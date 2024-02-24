export interface IUpdateRole {
  name?: string;
  description?: string;
  permissions?: {
    id: string;
  }[];
}
