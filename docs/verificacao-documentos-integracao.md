# Documentação de Integração - Verificação de Documentos e Atendimentos por Código

## Visão Geral

Este documento descreve a API de verificação de documentos e atendimentos assinados digitalmente no sistema SigSaúde. A API permite verificar a autenticidade de documentos e atendimentos através de um código de verificação (para documentos) ou código de atendimento (para atendimentos médicos).

## Endpoint de Verificação

### Verificar Documento ou Atendimento por Código

**Endpoint:** `GET /api/v1/documents/verify/:code`

**Descrição:** Verifica a autenticidade de um documento ou atendimento usando seu código.

**Parâmetros de URL:**
- `code` (string, obrigatório): Código de verificação impresso no documento (formato: SIG-XXXXXXXX-XXXXXX) ou código de atendimento (formato: ATD...)

**Resposta de Sucesso (200 OK):**
```json
{
  "isValid": true,
  "document": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "Atendimento Médico",
    "title": "Prontuário de Atendimento",
    "createdAt": "2023-10-15T14:30:00Z",
    "verificationCode": "SIG-12345678-ABC123",
    "verificationUrl": "https://sigsaude.apps.pm.pb.gov.br/verificar",
    "signatures": [
      {
        "id": "7b8e8400-e29b-41d4-a716-446655441111",
        "name": "Dr. João Silva",
        "role": "Médico",
        "date": "2023-10-15T15:45:00Z",
        "isValid": true,
        "certificateInfo": {
          "name": "Certificado Digital SigSaúde",
          "issuedBy": "SigSaúde CA",
          "validUntil": "2024-10-15T00:00:00Z"
        }
      }
    ]
  }
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "isValid": false,
  "message": "Documento não encontrado ou código de verificação inválido"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "isValid": false,
  "message": "Formato de código inválido. Use ATD... para atendimentos ou SIG-... para documentos"
}
```

**Resposta de Erro (500 Internal Server Error):**
```json
{
  "isValid": false,
  "message": "Erro interno ao verificar o documento"
}
```

## Fluxo de Verificação

1. O usuário recebe um documento ou atendimento assinado digitalmente com um código impresso
   - Para documentos: código de verificação (formato: SIG-XXXXXXXX-XXXXXX)
   - Para atendimentos: código de atendimento (formato: ATD...)
2. O usuário acessa a página de verificação em `https://sigsaude.apps.pm.pb.gov.br/verificar`
3. O usuário insere o código no campo apropriado
4. O frontend faz uma requisição para o endpoint `/api/v1/documents/verify/:code`
5. O backend identifica o tipo de código e verifica a autenticidade do documento ou atendimento e suas assinaturas
6. O frontend exibe o resultado da verificação ao usuário

## Implementação no Frontend

### Exemplo de Implementação em React

```typescript
import { useState } from 'react';
import axios from 'axios';

interface VerificationResult {
  isValid: boolean;
  document?: {
    id: string;
    type: string;
    title: string;
    code?: string;         // Código de atendimento (para atendimentos)
    createdAt: string;
    verificationCode?: string; // Código de verificação (para documentos)
    verificationUrl: string;
    patient?: {           // Informações do paciente (para atendimentos)
      id: string;
      name: string;
    };
    professional?: {      // Informações do profissional (para atendimentos)
      id: string;
      name: string;
    };
    specialty?: string;   // Especialidade (para atendimentos)
    location?: string;    // Local (para atendimentos)
    startDate?: string;   // Data de início (para atendimentos)
    endDate?: string;     // Data de fim (para atendimentos)
    signatures: Array<{
      id: string;
      name: string;
      role: string;
      date: string;
      isValid: boolean;
      certificateInfo?: {
        name: string;
        issuedBy: string;
        validUntil: string;
      };
    }>;
  };
  message?: string;
}

const VerifyDocument = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Por favor, insira um código válido');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get<VerificationResult>(
        `/api/v1/documents/verify/${code}`
      );
      setResult(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResult({
          isValid: false,
          message: 'Documento ou atendimento não encontrado ou código inválido'
        });
      } else if (err.response?.status === 400) {
        setError('Formato de código inválido. Use ATD... para atendimentos ou SIG-... para documentos');
      } else {
        setError('Ocorreu um erro ao verificar o documento ou atendimento. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Renderização do componente...
};
```

## Tratamento de Erros

O frontend deve tratar os seguintes cenários de erro:

1. **Código não encontrado (404):**
   - Exibir mensagem informando que o documento ou atendimento não foi encontrado ou o código é inválido

2. **Formato de código inválido (400):**
   - Validar o formato do código antes de enviar a requisição
   - Exibir mensagem de erro explicando os formatos corretos (ATD... para atendimentos, SIG-... para documentos)

3. **Erro interno do servidor (500):**
   - Exibir mensagem genérica de erro
   - Sugerir que o usuário tente novamente mais tarde

4. **Problemas de conectividade:**
   - Verificar a conexão com a internet
   - Exibir mensagem apropriada quando não houver conexão

## Segurança

- A API de verificação é pública e não requer autenticação
- Os códigos de verificação e atendimento são suficientemente complexos para evitar tentativas de adivinhação
- Os documentos e atendimentos verificados não são baixados automaticamente, apenas suas informações são exibidas
- Informações sensíveis não são retornadas na resposta da API

## Implementação no Backend

Para implementar esta funcionalidade no backend, é necessário:

1. Criar um endpoint para verificação de documentos e atendimentos
2. Implementar a lógica de validação dos códigos (verificação e atendimento)
3. Verificar a autenticidade das assinaturas digitais
4. Retornar as informações do documento ou atendimento e suas assinaturas

### Exemplo de Implementação no NestJS

```typescript
@Controller('documents')
export class DocumentVerificationController {
  constructor(private readonly documentVerificationService: DocumentVerificationService) {}

  @Public()
  @Get('verify/:code')
  async verifyDocument(@Param('code') code: string) {
    try {
      this.logger.log(`Verificando documento ou atendimento com código: ${code}`);

      // Usar o serviço de verificação para verificar o código
      return await this.documentVerificationService.verifyByCode(code);
    } catch (error) {
      this.logger.error(
        `Erro ao verificar documento ou atendimento: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno ao verificar o documento ou atendimento',
      );
    }
  }
}
```

## Considerações Adicionais

1. **Carimbo de Tempo:**
   - Considerar a implementação de carimbos de tempo para garantir a validade das assinaturas ao longo do tempo

2. **Verificação Offline:**
   - Avaliar a possibilidade de implementar um mecanismo de verificação offline através de QR Code

3. **Auditoria:**
   - Registrar todas as tentativas de verificação para fins de auditoria
   - Armazenar informações como IP, data/hora e resultado da verificação

4. **Expiração:**
   - Definir se os códigos de verificação devem expirar após um determinado período
   - Implementar lógica para informar ao usuário quando um código estiver expirado

5. **Diferentes Tipos de Documentos:**
   - O sistema suporta a verificação tanto de documentos gerais quanto de atendimentos médicos
   - A interface deve ser adaptada para exibir informações específicas de cada tipo de documento

---

## Histórico de Revisões

| Data       | Versão | Descrição                                  | Autor        |
|------------|--------|-------------------------------------------|--------------|
| 2023-10-20 | 1.0    | Versão inicial da documentação            | Equipe SigSaúde |
| 2023-10-25 | 1.1    | Adicionado suporte para verificação de atendimentos | Equipe SigSaúde |

