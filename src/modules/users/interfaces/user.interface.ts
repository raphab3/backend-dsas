import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  person_sig: PersonSig;
  created_at: Date;
  updated_at: Date;
}
