import { Inject, Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import IUsersRepository from '../typeorm/repositories/IUsersRepository';

interface UserOutput extends IUser {}

@Injectable()
export class FindByEmailUsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(email: string): Promise<UserOutput> {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }
}
