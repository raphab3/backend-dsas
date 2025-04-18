import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Certificate,
  CertificateType,
  CertificateStatus,
} from '../entities/certificate.entity';
import * as forge from 'node-forge';
import * as crypto from 'crypto';
import { InternalCaService } from './internal-ca.service';

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    private internalCaService: InternalCaService,
  ) {}

  async createInternalCertificate(params: {
    userId: string;
    name: string;
    password: string;
    validityDays?: number;
    isDefault?: boolean;
    userInfo?: {
      commonName?: string;
      organization?: string;
      email?: string;
    };
  }): Promise<Certificate> {
    try {
      // Gerar novo par de chaves
      const keys = forge.pki.rsa.generateKeyPair(2048);
      const privateKey = forge.pki.privateKeyToPem(keys.privateKey);

      // Criptografar a chave privada com a senha
      const encryptedPrivateKey = this.encryptPrivateKey(
        privateKey,
        params.password,
      );

      // Gerar hash da senha para verificação futura
      const passwordHash = await this.hashPassword(params.password);

      // Criar certificado assinado pela CA interna
      const { certificate, validFrom, validUntil } =
        await this.internalCaService.createUserCertificate({
          userId: params.userId,
          name: params.name,
          publicKey: keys.publicKey,
          validityDays: params.validityDays || 365,
          userInfo: params.userInfo,
        });

      // Se este é o certificado padrão, remover marcação de outros certificados
      if (params.isDefault) {
        await this.certificateRepository.update(
          { user_id: params.userId, is_default: true },
          { is_default: false },
        );
      }

      // Criar entidade de certificado
      const newCertificate = this.certificateRepository.create({
        user_id: params.userId,
        name: params.name,
        type: CertificateType.INTERNAL,
        status: CertificateStatus.ACTIVE,
        certificate: forge.pki.certificateToPem(certificate),
        private_key: encryptedPrivateKey,
        password_hash: passwordHash,
        is_default: params.isDefault ?? false,
        valid_from: validFrom,
        valid_until: validUntil,
      });

      return await this.certificateRepository.save(newCertificate);
    } catch (error) {
      this.logger.error(
        `Error creating certificate: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error creating certificate: ${error.message}`,
        400,
      );
    }
  }

  async importExternalCertificate(params: {
    userId: string;
    name: string;
    certificatePem: string;
    privateKeyPem?: string;
    password?: string;
    provider?: string;
    isDefault?: boolean;
  }): Promise<Certificate> {
    try {
      // Validar certificado
      const cert = forge.pki.certificateFromPem(params.certificatePem);

      // Extrair período de validade
      const validFrom = new Date(cert.validity.notBefore);
      const validUntil = new Date(cert.validity.notAfter);

      // Verificar se o certificado é válido
      const now = new Date();
      if (now > validUntil) {
        throw new Error('Certificate has expired');
      }

      // Se este é o certificado padrão, remover marcação de outros certificados
      if (params.isDefault) {
        await this.certificateRepository.update(
          { user_id: params.userId, is_default: true },
          { is_default: false },
        );
      }

      // Se tiver chave privada, criptografá-la
      let encryptedPrivateKey = null;
      let passwordHash = null;

      if (params.privateKeyPem && params.password) {
        encryptedPrivateKey = this.encryptPrivateKey(
          params.privateKeyPem,
          params.password,
        );
        passwordHash = await this.hashPassword(params.password);
      }

      // Criar entidade de certificado
      const newCertificate = this.certificateRepository.create({
        user_id: params.userId,
        name: params.name,
        type: CertificateType.EXTERNAL,
        status: CertificateStatus.ACTIVE,
        certificate: params.certificatePem,
        private_key: encryptedPrivateKey,
        password_hash: passwordHash,
        external_provider: params.provider,
        is_default: params.isDefault ?? false,
        valid_from: validFrom,
        valid_until: validUntil,
      });

      return await this.certificateRepository.save(newCertificate);
    } catch (error) {
      this.logger.error(
        `Error importing certificate: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error importing certificate: ${error.message}`,
        400,
      );
    }
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { user_id: userId },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async getCertificateById(id: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
    });
    if (!certificate) {
      throw new HttpException('Certificate not found', 404);
    }
    return certificate;
  }

  async getDecryptedPrivateKey(
    certificateId: string,
    password: string,
  ): Promise<string> {
    const certificate = await this.getCertificateById(certificateId);

    // Verificar se tem chave privada
    if (!certificate.private_key) {
      throw new HttpException('Certificate does not have a private key', 400);
    }

    // Verificar senha
    const passwordIsValid = await this.verifyPassword(
      password,
      certificate.password_hash,
    );
    if (!passwordIsValid) {
      throw new HttpException('Invalid certificate password', 401);
    }

    // Descriptografar chave privada
    try {
      return this.decryptPrivateKey(certificate.private_key, password);
    } catch (error) {
      this.logger.error(
        `Error decrypting private key: ${error.message}`,
        error.stack,
      );
      throw new HttpException('Error decrypting private key', 400);
    }
  }

  async setDefaultCertificate(
    id: string,
    userId: string,
  ): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!certificate) {
      throw new HttpException(
        'Certificate not found or does not belong to user',
        404,
      );
    }

    // Remover marcação de outros certificados
    await this.certificateRepository.update(
      { user_id: userId, is_default: true },
      { is_default: false },
    );

    // Definir este como padrão
    certificate.is_default = true;
    return this.certificateRepository.save(certificate);
  }

  async revokeCertificate(id: string, userId: string): Promise<void> {
    const certificate = await this.certificateRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!certificate) {
      throw new HttpException(
        'Certificate not found or does not belong to user',
        404,
      );
    }

    certificate.status = CertificateStatus.REVOKED;
    await this.certificateRepository.save(certificate);
  }

  private encryptPrivateKey(privateKey: string, password: string): string {
    // Usar forge para criptografar a chave privada com a senha
    const encryptedPem = forge.pki.encryptRsaPrivateKey(
      forge.pki.privateKeyFromPem(privateKey),
      password,
      { algorithm: 'aes256' },
    );
    return encryptedPem;
  }

  private decryptPrivateKey(encryptedKey: string, password: string): string {
    // Usar forge para descriptografar a chave privada com a senha
    const privateKey = forge.pki.decryptRsaPrivateKey(encryptedKey, password);
    return forge.pki.privateKeyToPem(privateKey);
  }

  private async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(
        password,
        process.env.PASSWORD_SALT || 'default-salt',
        64,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex'));
        },
      );
    });
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }
}
