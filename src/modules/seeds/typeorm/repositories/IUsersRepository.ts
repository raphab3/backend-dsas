import { ICreateUser } from '@modules/users/interfaces/ICreateUser';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IUser } from '@modules/users/interfaces/IUser';
import { IUserQuery } from '@modules/users/interfaces/IUserQuery';
import { IUpdateUser } from '@modules/users/interfaces/IUpdateUser';

export default interface IUsersRepository {
  create(data: ICreateUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | undefined>;
  list(query?: Partial<IUserQuery>): Promise<IPaginatedResult<IUser>>;
  findOne(id: string): Promise<IUser | undefined>;
  update(data: IUpdateUser): Promise<IUser>;
  getUserWithRolesAndPermissions(id: string): Promise<IUser>;
}
