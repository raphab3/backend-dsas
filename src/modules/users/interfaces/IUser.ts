import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  person_sig: PersonSig;
  roles: Role[];
  individual_permissions: any[];
  created_at: Date;
  updated_at: Date;
}
