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
  origem: Origin;
}

export enum Origin {
  PMPB = 'POLICIAL MILITAR ESTADUAL DA PARAÍBA (PMPB)',
  CBMPB = 'BOMBEIRO MILITAR ESTADUAL DA PARAÍBA (CBMPB)',
  FUNCIONARIO_CIVIL = 'FUNCIONARIO CIVIL PMPB',
  CIVIL = 'CIVIL',
}
