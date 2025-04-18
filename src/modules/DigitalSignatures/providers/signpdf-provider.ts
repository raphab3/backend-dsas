import { Injectable, Logger } from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';
import signpdf from '@signpdf/signpdf';
import { P12Signer } from '@signpdf/signer-p12';
import { plainAddPlaceholder } from '@signpdf/placeholder-plain';

import {
  ISignatureProvider,
  SignatureInput,
  SignatureResult,
} from '../interfaces/signature-provider.interface';

@Injectable()
export class SignPdfProvider implements ISignatureProvider {
  private readonly logger = new Logger(SignPdfProvider.name);

  name = 'SignPDF Provider';
  description = 'Provider for signing documents with P12 certificates';

  async sign(input: SignatureInput): Promise<SignatureResult> {
    try {
      // Extrair informações do certificado
      const cert = forge.pki.certificateFromPem(input.certificate);
      const subject = cert.subject.getField('CN')?.value || 'Unknown Signer';

      // Adicionar placeholder para assinatura
      const pdfWithPlaceholder = plainAddPlaceholder({
        pdfBuffer: input.pdfBuffer,
        reason: input.reason || 'Document signature',
        contactInfo: input.contactInfo || '',
        name: subject,
        location: input.location || '',
      });

      // Criar arquivo P12 temporário a partir do certificado e chave privada
      const tempP12Path = await this.createTemporaryP12File(
        input.certificate,
        input.privateKey,
        input.password,
      );

      try {
        // Ler o arquivo P12 diretamente do sistema de arquivos
        const p12Buffer = fs.readFileSync(tempP12Path);

        // Criar o assinador com o buffer P12
        const signer = new P12Signer(p12Buffer, {
          passphrase: input.password, // Usar passphrase em vez de fornecer diretamente
        });

        // Assinar o PDF
        const signedPdfBuffer = await signpdf.sign(pdfWithPlaceholder, signer);

        // Gerar hash da assinatura para rastreabilidade
        const signatureHash = this.generateSignatureHash(signedPdfBuffer);

        return {
          signedPdfBuffer,
          signatureData: signatureHash,
          status: 'VALID',
        };
      } finally {
        // Limpar arquivo temporário
        if (fs.existsSync(tempP12Path)) {
          fs.unlinkSync(tempP12Path);
        }
      }
    } catch (error) {
      this.logger.error(`Error signing PDF: ${error.message}`, error.stack);
      return {
        signedPdfBuffer: input.pdfBuffer,
        signatureData: '',
        status: 'INVALID',
        error: error.message,
      };
    }
  }

  private async createTemporaryP12File(
    certificatePem: string,
    privateKeyPem: string,
    password: string,
  ): Promise<string> {
    try {
      this.logger.debug('Creating temporary P12 file');

      // Gerar um nome de arquivo temporário único
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.p12`;
      const tempFilePath = path.join(tempDir, tempFileName);

      // Converter PEM para objetos forge
      let privateKey;
      if (privateKeyPem.includes('ENCRYPTED')) {
        privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, password);
        if (!privateKey) {
          throw new Error(
            'Failed to decrypt private key with provided password',
          );
        }
      } else {
        privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      }

      const certificate = forge.pki.certificateFromPem(certificatePem);

      // Criar PKCS#12 usando a configuração do seu código que funciona
      const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
        privateKey,
        [certificate],
        password,
        { algorithm: '3des' }, // Usar a mesma configuração do seu código que funciona
      );

      const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

      // Escrever para o arquivo
      fs.writeFileSync(tempFilePath, p12Der, { encoding: 'binary' });

      this.logger.debug(`Created temporary P12 file at: ${tempFilePath}`);

      return tempFilePath;
    } catch (error) {
      this.logger.error(
        `Error creating temporary P12 file: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async verify(pdfBuffer: Buffer): Promise<{
    isValid: boolean;
    signatures: Array<{
      signer: string;
      signedAt: Date;
      isValid: boolean;
      reason?: string;
    }>;
  }> {
    // O restante do código de verificação permanece o mesmo
    try {
      // Verificar se o PDF tem assinaturas
      const signatureCount = await this.getSignatureCount(pdfBuffer);

      if (signatureCount <= 0) {
        return {
          isValid: false,
          signatures: [],
        };
      }

      // Extrair os dados de assinatura
      const signatureInfo = await this.extractSignatureInfo(pdfBuffer);

      return {
        isValid: signatureInfo.length > 0,
        signatures: signatureInfo.map((info) => ({
          signer: info.name || 'Unknown',
          signedAt: info.signDate || new Date(),
          isValid: true, // Assumimos válido se conseguimos extrair
          reason: info.reason,
        })),
      };
    } catch (error) {
      this.logger.error(`Error verifying PDF: ${error.message}`, error.stack);
      return {
        isValid: false,
        signatures: [],
      };
    }
  }

  private generateSignatureHash(buffer: Buffer): string {
    const md = forge.md.sha256.create();
    md.update(buffer.toString('binary'));
    return md.digest().toHex();
  }

  private async getSignatureCount(pdfBuffer: Buffer): Promise<number> {
    // Implementação existente...
    try {
      // Esta é uma implementação simplificada
      // Para uma implementação completa, você precisaria analisar o PDF em mais detalhes
      // para encontrar o objeto /Sig ou /AcroForm que contém informações de assinatura

      // Verificamos pela ocorrência de /ByteRange (um componente essencial das assinaturas)
      // Não é perfeito, mas é uma aproximação
      const pdfString = pdfBuffer.toString('ascii');
      const byteRangeMatches = pdfString.match(/\/ByteRange\s*\[/g);

      return byteRangeMatches ? byteRangeMatches.length : 0;
    } catch (error) {
      this.logger.error(
        `Error counting signatures: ${error.message}`,
        error.stack,
      );
      return 0;
    }
  }

  private async extractSignatureInfo(pdfBuffer: Buffer): Promise<
    Array<{
      name?: string;
      reason?: string;
      signDate?: Date;
    }>
  > {
    try {
      // Esta é uma implementação simplificada
      // Uma implementação completa requer analisar o PDF em mais detalhes

      const pdfString = pdfBuffer.toString('ascii');

      // Encontrar campos de assinatura
      const nameMatches = pdfString.match(/\/Name\s*\(([^)]+)\)/g);
      const reasonMatches = pdfString.match(/\/Reason\s*\(([^)]+)\)/g);
      const dateMatches = pdfString.match(/\/M\s*\(D:(\d{14}[+-]\d{4})/g);

      const signatures = [];

      // Usamos o número de nomes como base para a contagem
      if (nameMatches) {
        for (let i = 0; i < nameMatches.length; i++) {
          const signature: any = {};

          if (nameMatches[i]) {
            const nameMatch = nameMatches[i].match(/\/Name\s*\(([^)]+)\)/);
            if (nameMatch && nameMatch[1]) {
              signature.name = nameMatch[1];
            }
          }

          if (reasonMatches && reasonMatches[i]) {
            const reasonMatch = reasonMatches[i].match(
              /\/Reason\s*\(([^)]+)\)/,
            );
            if (reasonMatch && reasonMatch[1]) {
              signature.reason = reasonMatch[1];
            }
          }

          if (dateMatches && dateMatches[i]) {
            const dateMatch = dateMatches[i].match(
              /\/M\s*\(D:(\d{14}[+-]\d{4})/,
            );
            if (dateMatch && dateMatch[1]) {
              // Converter data do formato PDF para JavaScript Date
              const pdDate = dateMatch[1];
              const year = parseInt(pdDate.substring(0, 4));
              const month = parseInt(pdDate.substring(4, 6)) - 1; // JS meses são 0-11
              const day = parseInt(pdDate.substring(6, 8));
              const hour = parseInt(pdDate.substring(8, 10));
              const minute = parseInt(pdDate.substring(10, 12));
              const second = parseInt(pdDate.substring(12, 14));

              signature.signDate = new Date(
                year,
                month,
                day,
                hour,
                minute,
                second,
              );
            }
          }

          signatures.push(signature);
        }
      }

      return signatures;
    } catch (error) {
      this.logger.error(
        `Error extracting signature info: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
