export interface ISpecialty {
  id: string;
  name: string;
  formation: FormationEnum;
  created_at: Date;
  updated_at: Date;
}

export enum FormationEnum {
  MEDICINA = 'MEDICINA',
  ENFERMAGEM = 'ENFERMAGEM',
  ODONTOLOGIA = 'ODONTOLOGIA',
  PSICOLOGIA = 'PSICOLOGIA',
  FISIOTERAPIA = 'FISIOTERAPIA',
  FARMACIA = 'FARMÁCIA',
  FONOAUDIOLOGIA = 'FONOAUDIOLOGIA',
  NUTRICAO = 'NUTRIÇÃO',
  BIOMEDICINA = 'BIOMEDICINA',
  EDUCACAO_FISICA = 'EDUCAÇÃO FÍSICA',
}
