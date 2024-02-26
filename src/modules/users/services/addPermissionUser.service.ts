import PermissionRepository from '@modules/permissions/typeorm/repositories/PermissionRepository';
import RoleRepository from '@modules/roles/typeorm/repositories/RoleRepository';
import UsersRepository from '@modules/users/typeorm/repositories/UsersRepository';
import { Injectable } from '@nestjs/common';

interface IRequest {
  permission?: string;
  role?: string;
  user_id: string;
}

@Injectable()
export class AddPermissionUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute({ permission, role, user_id }: IRequest): Promise<{
    message: string;
  }> {
    const user = await this.usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    if (role) {
      const userRoles = user.roles || [];
      const roleFound = await this.roleRepository.findByName(role);

      if (roleFound) {
        await this.usersRepository.update({
          id: user_id,
          roles: [...userRoles, roleFound],
        });
      }
    }

    if (permission) {
      const userPermissions = user.individual_permissions || [];
      const permissionsFound = await this.permissionRepository.findByNames([
        permission,
      ]);

      if (permissionsFound.length > 0) {
        await this.usersRepository.update({
          id: user_id,
          individual_permissions: [...userPermissions, ...permissionsFound],
        });
      }
    }

    return {
      message: 'Permission added successfully',
    };
  }
}
