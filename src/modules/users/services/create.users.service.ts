import { HttpException, Inject, Injectable } from '@nestjs/common';
import IUsersRepository from '../typeorm/repositories/IUsersRepository';
import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserOutput {
  id: string;
  name: string;
  email: string;
}

interface ICreateUser extends CreateUserInput {
  salt: string;
}

@Injectable()
export class CreateUsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute(createUser: CreateUserInput): Promise<CreateUserOutput> {
    const { hash, salt } = await this.hashProvider.generateHash(
      createUser.password,
    );

    const newUser: ICreateUser = {
      ...createUser,
      password: hash,
      salt: salt,
    };

    const userExists = await this.usersRepository.findByEmail(newUser.email);

    if (userExists) {
      throw new HttpException('User already exists', 409);
    }

    const { id, name, email } = await this.usersRepository.create(newUser);
    return { id, name, email };
  }
}
