export interface IAsset {
  id: string;
  description: string;
  destination: string;
  destination_responsible: string;
  origin: string;
  origin_responsible: string;
  patrimony: string;
  date_acquisition: Date;
  responsible: string;
  acquisition: string;
  location: string;
  observations: string;
  movimentations: string;
  created_at: Date;
  updated_at: Date;
}
