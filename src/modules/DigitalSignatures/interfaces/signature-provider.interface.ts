export interface SignatureInput {
  pdfBuffer: Buffer;
  certificate: string; // Certificado PEM
  privateKey: string; // Chave privada PEM
  password: string; // Senha para a chave privada
  reason?: string; // Motivo da assinatura
  location?: string; // Localização da assinatura
  contactInfo?: string; // Informações de contato
  signaturePosition?: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SignatureResult {
  signedPdfBuffer: Buffer;
  signatureData: string;
  status: 'VALID' | 'INVALID';
  error?: string;
}

export interface ISignatureProvider {
  name: string;
  description: string;
  sign(input: SignatureInput): Promise<SignatureResult>;
  verify(pdfBuffer: Buffer): Promise<{
    isValid: boolean;
    signatures: Array<{
      signer: string;
      signedAt: Date;
      isValid: boolean;
      reason?: string;
    }>;
  }>;
}
