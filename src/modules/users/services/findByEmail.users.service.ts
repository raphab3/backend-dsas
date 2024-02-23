import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface UserOutput extends IUser {}

@Injectable()
export class FindByEmailUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string): Promise<UserOutput> {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }
}
