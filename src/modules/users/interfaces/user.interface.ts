import { Role } from '@guards/rule.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  rules: Role[];
  created_at: Date;
  updated_at: Date;
}
