import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';
import RoleRepository from '@modules/roles/typeorm/repositories/RoleRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import { CreateUserDto } from '../dto/create-user.dto';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

export interface CreateUserOutput {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class CreateUsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
    private rolesRepository: RoleRepository,
  ) {}

  async execute(createUser: CreateUserDto): Promise<CreateUserOutput> {
    const userExists = await this.usersRepository.findByEmail(createUser.email);
    if (userExists) {
      throw new HttpException('Usuário já existe', 409);
    }

    const { hash, salt } = await this.hashProvider.generateHash(
      createUser.password,
    );

    const roles = await this.validateRoles(createUser.roles);

    const newUser = await this.usersRepository.create({
      ...createUser,
      name: createUser.name.trim().toUpperCase(),
      email: createUser.email
        ? createUser.email.trim().toLowerCase()
        : createUser.email,
      password: hash,
      salt: salt,
      roles,
    });

    newUser.password = undefined;
    newUser.salt = undefined;

    return newUser;
  }

  private async validateRoles(roleNames: string[]): Promise<{ id: string }[]> {
    if (!roleNames || roleNames.length === 0) return [];

    const roles = await this.rolesRepository.findByNames(roleNames);

    if (roles.length !== roleNames.length) {
      throw new HttpException('Uma ou mais roles não existem', 400);
    }

    return roles.map((role) => ({ id: role.id }));
  }
}
