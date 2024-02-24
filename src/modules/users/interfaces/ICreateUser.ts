export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  roles?: {
    id: string;
  }[];
  salt: string;
}
