import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { Repository } from 'typeorm';
import { PermissionsEnumList } from '@modules/permissions/interfaces/permissionsEnum';

@Injectable()
export class SyncPermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(): Promise<void> {
    try {
      const allPermissionsEnumValues = PermissionsEnumList;
      const allExistingPermissions = await this.permissionRepository.find();

      // Inserir ou atualizar permissões conforme necessário
      for await (const permission of allPermissionsEnumValues) {
        const new_permission = {
          name: permission as any,
          description: `Permissão para ${permission}`,
        };

        const permissionExists = allExistingPermissions.find(
          (p) => p.name === permission,
        );

        if (!permissionExists) {
          console.log('Permission not found', new_permission);
          await this.permissionRepository.save(new_permission);
          console.log('Permission created', new_permission);
        }
      }

      console.log('Finished permissions sync');

      // // Remover permissões que não estão na enumeração
      // const permissionsToRemove = allExistingPermissions.filter(
      //   (p) => !allPermissionsEnumValues.includes(p.name as any),
      // );

      // for await (const permission of permissionsToRemove) {
      //   await this.permissionRepository.remove(permission);
      //   console.log('Permission removed', permission);
      // }
    } catch (error) {
      console.error('Erro ao executar a sincronização de permissões', error);
    }
  }
}
