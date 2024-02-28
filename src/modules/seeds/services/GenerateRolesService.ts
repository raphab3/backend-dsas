import PermissionRepository from '@modules/permissions/typeorm/repositories/PermissionRepository';
import RoleRepository from '@modules/roles/typeorm/repositories/RoleRepository';
import { groupsOfPermissions } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateRolesService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(): Promise<string> {
    Object.keys(groupsOfPermissions).map(async (role) => {
      const permissions = groupsOfPermissions[role];

      const findPermissions =
        await this.permissionRepository.findByNames(permissions);

      const roleExists = await this.roleRepository.findByName(role);

      console.log(roleExists);

      if (!roleExists) {
        const roleSaved = await this.roleRepository.create({
          name: role,
          description: `Grupo de permissões para ${role}`,
        });

        console.log(roleSaved);

        const rolesUpdate = await this.roleRepository.addPermissions(
          roleSaved,
          findPermissions,
        );

        console.log(rolesUpdate);
      }
    });

    return 'Permission added';
  }
}
