import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';
import RoleRepository from '@modules/roles/typeorm/repositories/RoleRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface CreateUserOutput {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class UpdateUsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
    private rolesRepository: RoleRepository,
  ) {}
  async execute(
    id: string,
    updateUser: UpdateUserDto,
  ): Promise<CreateUserOutput> {
    const userFound = await this.usersRepository.findOne(id);
    if (!userFound) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Atualizar propriedades simples
    userFound.email = updateUser.email;
    userFound.name = updateUser.name;

    // Se a senha foi fornecida, atualize-a
    if (updateUser.password) {
      const { hash, salt } = await this.hashProvider.generateHash(
        updateUser.password,
      );
      userFound.password = hash;
      userFound.salt = salt;
    }

    // Validar e atualizar roles
    if (updateUser.roles && updateUser.roles.length > 0) {
      const newRoles = await this.validateRoles(updateUser.roles);
      userFound.roles = await this.rolesRepository.findByIds(
        newRoles.map((role) => role.id),
      );
    }

    // Salvar a entidade atualizada
    const updatedUser = await this.usersRepository.update(userFound);

    // Remover propriedades sensíveis antes de retornar
    updatedUser.password = undefined;
    updatedUser.salt = undefined;

    return updatedUser;
  }

  private async validateRoles(roleNames: string[]): Promise<{ id: string }[]> {
    if (!roleNames || roleNames.length === 0) return [];

    const roles = await this.rolesRepository.findByNames(roleNames);

    console.log('validateRoles: roleNames', roleNames);
    console.log('validateRoles: roles', roles);

    if (roles.length !== roleNames.length) {
      throw new HttpException('Uma ou mais roles não existem', 400);
    }

    return roles.map((role) => ({ id: role.id }));
  }
}
