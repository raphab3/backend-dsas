export interface IUpdateUser {
  id: string;
  password?: string;
  salt?: string;
  email?: string;
  name?: string;
  roles?: { id: string }[];
}
