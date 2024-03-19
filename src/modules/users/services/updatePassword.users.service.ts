import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdatePasswordUsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  async execute(id: string, updateUser: Partial<UpdateUserDto>): Promise<void> {
    const userFound = await this.usersRepository.findOne(id);

    console.log('userFound', userFound);

    if (!userFound) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    if (!updateUser.oldPassword) {
      throw new HttpException('Senha antiga é obrigatória', 400);
    }

    if (!updateUser.password) {
      throw new HttpException('Nova senha é obrigatória', 400);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      updateUser.oldPassword,
      userFound.password,
      userFound.salt,
    );

    console.log(
      'passwordMatched',
      passwordMatched,
      updateUser.password,
      userFound.password,
      userFound.salt,
    );

    if (!passwordMatched) {
      throw new HttpException('Senha antiga não confere', 400);
    }

    const { hash, salt } = await this.hashProvider.generateHash(
      updateUser.password,
    );

    userFound.password = hash;
    userFound.salt = salt;

    await this.usersRepository.update(userFound);
  }
}
