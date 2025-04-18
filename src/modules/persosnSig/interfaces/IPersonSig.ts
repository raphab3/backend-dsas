export interface IPersonSig {
  id: string;
  patente: string;
  nome: string;
  funcao: string;
  identidade_militar: number;
  data_nascimento: Date | string;
  cod_unidade: number;
  unidade: string;
  imagem: string;
  nome_guerra: string;
  admissao: Date | string;
  matricula: string;
  regime: string;
  cpf: string;
  sexo: string;
  email: string;
  pai: string;
  mae: string;
  naturalidade: string;
  estado_civil: string;
  ddd: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
  rg: number;
  orgao_exp: string;
  tipo_servidor: OriginType;
}

export type OriginType = 'PMPB' | 'CBMPB' | 'FUNCIONARIO_CIVIL' | 'CIVIL';

export const Origin = {
  PMPB: 'PMPB',
  CBMPB: 'CBMPB',
  FUNCIONARIO_CIVIL: 'FUNCIONARIO_CIVIL',
  CIVIL: 'CIVIL',
} as const;

export type TipoServidorExternal = 'POLICIAL MILITAR' | 'BOMBEIRO MILITAR';
