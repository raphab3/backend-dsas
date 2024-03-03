export interface ILocation {
  id: string;
  name: string;
  description: string;
  city: LocationCityEnum;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateLocation {
  name: string;
  description?: string;
  city: LocationCityEnum;
}

export enum LocationCityEnum {
  JOAO_PESSOA = 'JOÃO PESSOA',
  CAMPINA_GRANDE = 'CAMPINA GRANDE',
  PATOS = 'PATOS',
  SOUSA = 'SOUSA',
  GUARABIRA = 'GUARABIRA',
}
