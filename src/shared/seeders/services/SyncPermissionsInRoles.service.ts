import { groupsOfPermissions } from '@modules/permissions/interfaces/permissionsEnum';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

@Injectable()
export class SyncPermissionsInRolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async execute(): Promise<void> {
    try {
      const allRoles = await this.roleRepository.find({
        relations: ['permissions'],
      });

      for await (const roleName of Object.keys(groupsOfPermissions)) {
        const permissionsNames = groupsOfPermissions[roleName];

        const roleFound = allRoles.find((role) => role.name === roleName);

        if (!roleFound) {
          throw new Error('Role not found');
        }

        const desiredPermissions = await this.permissionRepository.find({
          where: { name: In(permissionsNames) },
        });

        const desiredPermissionIds = desiredPermissions.map(
          (permission) => permission.id,
        );

        const currentPermissionIds = roleFound.permissions.map(
          (permission) => permission.id,
        );

        const permissionsToAdd = desiredPermissions.filter(
          (permission) => !currentPermissionIds.includes(permission.id),
        );

        const permissionsToRemoveIds = currentPermissionIds.filter(
          (id) => !desiredPermissionIds.includes(id),
        );

        // Adicionando novas permissões
        roleFound.permissions = [...roleFound.permissions, ...permissionsToAdd];

        // Removendo permissões não desejadas
        roleFound.permissions = roleFound.permissions.filter(
          (permission) => !permissionsToRemoveIds.includes(permission.id),
        );

        await this.roleRepository.save(roleFound);
      }
    } catch (error) {
      console.error('Error on execute seed', error);
    }
  }
}
