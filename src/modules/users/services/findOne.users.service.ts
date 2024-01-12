import { Injectable } from '@nestjs/common';
import UsersRepository from '../typeorm/repositories/UsersRepository';

@Injectable()
export class FindOneUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string): Promise<any> {
    return await this.usersRepository.findOne(id);
  }
}
