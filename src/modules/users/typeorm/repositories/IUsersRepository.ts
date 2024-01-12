import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { IUserQuery } from '@modules/users/interfaces/IUserQuery';
import { IUser } from '@modules/users/interfaces/user.interface';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IUsersRepository {
  create(data: CreateUserDto): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | undefined>;
  list(query?: Partial<IUserQuery>): Promise<IPaginatedResult<IUser>>;
  findOne(id: string): Promise<IUser | undefined>;
}
