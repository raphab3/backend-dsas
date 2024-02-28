import { Injectable } from '@nestjs/common';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { IUserQuery } from '../interfaces/IUserQuery';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IUser } from '../interfaces/IUser';

@Injectable()
export class FindAllUsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  public async findAll(
    query: Partial<IUserQuery>,
  ): Promise<IPaginatedResult<IUser>> {
    const users = await this.userRepository.list(query);

    users.data = users.data.map((user) => {
      delete user.password;
      delete user.salt;
      return user;
    });

    return users;
  }
}
