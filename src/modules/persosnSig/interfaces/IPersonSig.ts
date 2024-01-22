export interface IPersonSig {
  id: string;
  name: string;
  patent: string;
  post: string;
  military_identity: string;
  date_birth: Date;
  cod_unit: string;
  situation: string;
  unit: string;
  image: string;
  is_military: boolean;
  name_war: string;
  admission: Date;
  registration: string;
  regime: string;
  cpf: string;
  driver_license: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  father: string;
  mother: string;
  nationality: string;
  marital_status: string;
  ddd: string;
  phone: string;
  email: string;
  rg: string;
  organ_exp: string;
  created_at: Date;
  updated_at: Date;
}

export interface IServidor {
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
  carteira_motorista: number;
  vencimento_motorista: Date | string;
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
}

// dto IServidor from IPersonSig
