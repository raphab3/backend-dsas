import PermissionRepository from '@modules/permissions/typeorm/repositories/PermissionRepository';
import { Injectable } from '@nestjs/common';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';

@Injectable()
export class GeneratePermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(): Promise<string> {
    Object.values(ListOfPermissionsEnum).map(async (permission) => {
      const new_permission = {
        name: permission,
        description: `Permissão para ${permission}`,
      };

      console.log('new_permission', new_permission);

      await this.permissionRepository
        .create(new_permission)
        .catch((error) =>
          console.log(
            `Erro ao salvar a permissão: ${new_permission.name}`,
            error,
          ),
        );
    });

    return 'Permission added';
  }
}
