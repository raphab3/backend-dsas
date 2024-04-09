import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordUsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  async execute(id: string): Promise<void> {
    const userFound = await this.usersRepository.findOne(id);

    if (!userFound) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    const cpf = userFound?.person_sig?.cpf;

    if (!cpf) {
      throw new HttpException('CPF não encontrado', 404);
    }

    const { hash, salt } = await this.hashProvider.generateHash(cpf);

    userFound.password = hash;
    userFound.salt = salt;

    await this.usersRepository.update(userFound);
  }
}
