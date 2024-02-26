import PermissionRepository from '@modules/permissions/typeorm/repositories/PermissionRepository';
import { Injectable } from '@nestjs/common';
import { groupsOfPermissions } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import RoleRepository from '@modules/roles/typeorm/repositories/RoleRepository';

@Injectable()
export class GenerateRolesService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(): Promise<string> {
    Object.keys(groupsOfPermissions).map(async (role) => {
      const permissions = groupsOfPermissions[role];

      // return permission {id: 'uuid'}[]
      const findPermissions =
        await this.permissionRepository.findByNames(permissions);

      console.log('findPermissions', findPermissions);

      const roleExists = await this.roleRepository.findByName(role);

      if (!roleExists) {
        const roleSaved = await this.roleRepository.create({
          name: role,
          description: `Grupo de permissões para ${role}`,
        });

        console.log('roleSaved', roleSaved);
        await this.roleRepository.addPermissions(roleSaved, findPermissions);
      }
    });

    return 'Permission added';
  }
}
