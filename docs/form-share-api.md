# API de Compartilhamento de Formulários

Esta documentação descreve como utilizar a API de compartilhamento de formulários para gerar links que podem ser enviados aos pacientes.

## Visão Geral

O sistema de compartilhamento de formulários permite que profissionais de saúde gerem links curtos que podem ser enviados aos pacientes para preenchimento de formulários fora do ambiente de atendimento. Esses links têm validade limitada e são associados a um paciente específico.

## Endpoints

### 1. Criar Link de Compartilhamento

**Endpoint:** `POST /form-shares`

**Autenticação:** Requer token JWT

**Permissão necessária:** `create_form_response`

**Corpo da requisição:**

```json
{
  "formResponseId": "680288f9d2c223c4d0c5285a", // ID do MongoDB do FormResponse
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "attendanceId": "123e4567-e89b-12d3-a456-426614174000", // opcional
  "expirationDays": 7 // opcional, padrão: 7 dias
}
```

**Resposta:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "shortCode": "Ab3X7pQr",
  "formUrl": "http://localhost:3000/forms/public/Ab3X7pQr",
  "expiresAt": "2023-07-30T15:30:45.123Z"
}
```

### 2. Validar Código de Compartilhamento

**Endpoint:** `GET /form-shares/validate/:shortCode`

**Autenticação:** Público (não requer autenticação)

**Resposta:**

```json
{
  "tokenId": "123e4567-e89b-12d3-a456-426614174000",
  "formResponseId": "680288f9d2c223c4d0c5285a", // ID do MongoDB do FormResponse
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "attendanceId": "123e4567-e89b-12d3-a456-426614174000", // pode ser null
  "expiresAt": "2023-07-30T15:30:45.123Z"
}
```

### 3. Obter Informações do Formulário Público

**Endpoint:** `GET /public-forms/:shortCode`

**Autenticação:** Público (não requer autenticação)

**Resposta:**

```json
{
  "tokenId": "123e4567-e89b-12d3-a456-426614174000",
  "formResponse": {
    "_id": "680288f9d2c223c4d0c5285a",
    "name": "Avaliação Médica",
    "description": "Observações adicionais sobre o diagnóstico",
    "sessions": [
      // sessões do formulário com campos
    ]
  },
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "expiresAt": "2023-07-30T15:30:45.123Z"
}
```

### 4. Enviar Resposta de Formulário Público

**Endpoint:** `POST /public-forms/:tokenId/submit`

**Autenticação:** Público (não requer autenticação)

**Corpo da requisição:**

```json
{
  "sessions": [
    {
      "_id": "680288f9d2c223c4d0c5285b",
      "name": "Informações Gerais",
      "fields": [
        {
          "_id": "680288f9d2c223c4d0c5285c",
          "name": "sintomas",
          "response": "Dor de cabeça e febre"
        },
        // outros campos preenchidos
      ]
    },
    // outras sessões
  ]
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Formulário enviado com sucesso"
}
```

## Fluxo de Uso

1. **Profissional gera o link**:
   - O profissional seleciona uma resposta de formulário existente para compartilhar
   - Seleciona o paciente
   - Opcionalmente, associa a um atendimento
   - O sistema gera um token e um código curto

2. **Compartilhamento**:
   - O profissional compartilha o link via WhatsApp, SMS ou email
   - O link tem o formato: `https://seu-dominio.com/forms/public/{shortCode}`

3. **Paciente acessa o formulário**:
   - O paciente acessa o link
   - O sistema valida o token (existência e validade)
   - O sistema exibe o formulário para preenchimento

4. **Paciente preenche e envia**:
   - O paciente preenche o formulário
   - Ao enviar, o sistema atualiza a resposta existente e marca o token como usado
   - A resposta atualizada é associada ao paciente e, se aplicável, ao atendimento

## Considerações de Segurança

- Os links têm validade limitada (padrão: 7 dias)
- Cada link só pode ser usado uma vez
- Os tokens são gerados de forma segura usando o módulo crypto do Node.js
- Os códigos curtos são gerados com caracteres que evitam ambiguidade (sem 0/O, 1/l, etc.)

## Integração com o Frontend

Para integrar com o frontend, você precisará:

1. **Criar uma página para geração de links**:
   - Permitir a seleção de formulários, pacientes e atendimentos
   - Exibir o link gerado e opções de compartilhamento

2. **Criar uma página pública para preenchimento de formulários**:
   - Acessível sem autenticação
   - Validar o código do link
   - Exibir o formulário para preenchimento
   - Enviar a resposta para o backend

3. **Adicionar notificações**:
   - Notificar o profissional quando um formulário for preenchido
   - Exibir status dos formulários compartilhados (pendente, preenchido, expirado)
