import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalCaService implements OnModuleInit {
  private readonly logger = new Logger(InternalCaService.name);
  private caCertificate: forge.pki.Certificate;
  private caPrivateKey: forge.pki.PrivateKey;
  private caConfig: {
    countryName: string;
    stateOrProvinceName: string;
    localityName: string;
    organizationName: string;
    organizationalUnitName: string;
    commonName: string;
    emailAddress: string;
  };

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Inicializar a CA interna
    await this.initializeCA();
  }

  private async initializeCA() {
    try {
      this.caConfig = {
        countryName: this.configService.get('CA_COUNTRY') || 'BR',
        stateOrProvinceName: this.configService.get('CA_STATE') || 'São Paulo',
        localityName: this.configService.get('CA_LOCALITY') || 'São Paulo',
        organizationName: this.configService.get('CA_ORG_NAME') || 'Sistema',
        organizationalUnitName:
          this.configService.get('CA_ORG_UNIT') || 'Autoridade Certificadora',
        commonName: this.configService.get('CA_COMMON_NAME') || 'Sistema CA',
        emailAddress: this.configService.get('CA_EMAIL') || 'admin@sistema.com',
      };

      // Verificar se já existe certificado de CA
      const caCertPath =
        process.env.CA_CERT_PATH ||
        path.join(process.cwd(), 'ca', 'ca-certificate.pem');
      const caKeyPath =
        process.env.CA_KEY_PATH ||
        path.join(process.cwd(), 'ca', 'ca-private-key.pem');

      if (fs.existsSync(caCertPath) && fs.existsSync(caKeyPath)) {
        // Carregando certificado existente
        const caCertPem = fs.readFileSync(caCertPath, 'utf8');
        const caKeyPem = fs.readFileSync(caKeyPath, 'utf8');

        this.caCertificate = forge.pki.certificateFromPem(caCertPem);
        this.caPrivateKey = forge.pki.privateKeyFromPem(caKeyPem);

        this.logger.log('CA certificate and private key loaded successfully');
      } else {
        // Criar diretório para CA se não existir
        const caDir = path.dirname(caCertPath);
        if (!fs.existsSync(caDir)) {
          fs.mkdirSync(caDir, { recursive: true });
        }

        // Gerar novo certificado de CA
        const result = await this.generateCA();

        // Salvar certificado e chave privada
        fs.writeFileSync(
          caCertPath,
          forge.pki.certificateToPem(result.certificate),
        );
        fs.writeFileSync(
          caKeyPath,
          forge.pki.privateKeyToPem(result.privateKey),
        );

        this.caCertificate = result.certificate;
        this.caPrivateKey = result.privateKey;

        this.logger.log(
          'New CA certificate and private key generated successfully',
        );
      }
    } catch (error) {
      this.logger.error(`Error initializing CA: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async generateCA() {
    // Gerar par de chaves RSA
    const keys = forge.pki.rsa.generateKeyPair(4096);

    // Criar certificado
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';

    // Validade: 10 anos
    const currentDate = new Date();
    cert.validity.notBefore = currentDate;
    const expirationDate = new Date();
    expirationDate.setFullYear(currentDate.getFullYear() + 10);
    cert.validity.notAfter = expirationDate;

    // Definir atributos
    const attributes = [
      { name: 'commonName', value: this.caConfig.commonName },
      { name: 'countryName', value: this.caConfig.countryName },
      { shortName: 'ST', value: this.caConfig.stateOrProvinceName },
      { name: 'localityName', value: this.caConfig.localityName },
      { name: 'organizationName', value: this.caConfig.organizationName },
      { shortName: 'OU', value: this.caConfig.organizationalUnitName },
      { name: 'emailAddress', value: this.caConfig.emailAddress },
    ];

    cert.setSubject(attributes);
    cert.setIssuer(attributes);

    // Auto-assinado
    cert.sign(keys.privateKey, forge.md.sha256.create());

    return {
      certificate: cert,
      privateKey: keys.privateKey,
    };
  }

  async createUserCertificate(params: {
    userId: string;
    name: string;
    publicKey: forge.pki.PublicKey;
    validityDays: number;
    userInfo?: {
      commonName?: string;
      organization?: string;
      email?: string;
    };
  }) {
    try {
      // Criar certificado
      const cert = forge.pki.createCertificate();
      cert.publicKey = params.publicKey;

      // Gerar serial único baseado em timestamp e UUID parcial do usuário
      const timestamp = Date.now().toString(16);
      const userIdPart = params.userId.replace(/-/g, '').substring(0, 8);
      cert.serialNumber = `${timestamp}${userIdPart}`;

      // Definir validade
      const currentDate = new Date();
      const validFrom = new Date();
      cert.validity.notBefore = validFrom;

      const validUntil = new Date();
      validUntil.setDate(currentDate.getDate() + params.validityDays);
      cert.validity.notAfter = validUntil;

      // Definir atributos
      const attributes = [
        {
          name: 'commonName',
          value: params.userInfo?.commonName || params.name,
        },
        { name: 'countryName', value: this.caConfig.countryName },
        { shortName: 'ST', value: this.caConfig.stateOrProvinceName },
        { name: 'localityName', value: this.caConfig.localityName },
        {
          name: 'organizationName',
          value:
            params.userInfo?.organization || this.caConfig.organizationName,
        },
        { shortName: 'OU', value: 'Usuário' },
        {
          name: 'emailAddress',
          value: params.userInfo?.email || `user-${params.userId}@sistema.com`,
        },
      ];

      cert.setSubject(attributes);

      // Definir emissor (a CA)
      cert.setIssuer([
        { name: 'commonName', value: this.caConfig.commonName },
        { name: 'countryName', value: this.caConfig.countryName },
        { shortName: 'ST', value: this.caConfig.stateOrProvinceName },
        { name: 'localityName', value: this.caConfig.localityName },
        { name: 'organizationName', value: this.caConfig.organizationName },
        { shortName: 'OU', value: this.caConfig.organizationalUnitName },
        { name: 'emailAddress', value: this.caConfig.emailAddress },
      ]);

      // Definir extensões
      const extensions = [
        {
          name: 'basicConstraints',
          cA: false,
        },
        {
          name: 'keyUsage',
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
          codeSigning: true,
          emailProtection: true,
          timeStamping: true,
        },
        {
          name: 'nsCertType',
          client: true,
          email: true,
        },
        {
          name: 'subjectAltName',
          altNames: [
            {
              type: 2, // DNS
              value: 'localhost',
            },
            {
              type: 6, // URI
              value: `urn:uuid:${params.userId}`,
            },
          ],
        },
        {
          name: 'subjectKeyIdentifier',
        },
      ];

      // Adicionar extensões
      extensions.forEach((extension) => {
        cert.setExtensions([extension]);
      });

      // Assinar com a chave privada da CA
      cert.sign(this.caPrivateKey, forge.md.sha256.create());

      return {
        certificate: cert,
        validFrom,
        validUntil,
      };
    } catch (error) {
      this.logger.error(
        `Error creating user certificate: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  getCACertificate(): string {
    return forge.pki.certificateToPem(this.caCertificate);
  }
}
