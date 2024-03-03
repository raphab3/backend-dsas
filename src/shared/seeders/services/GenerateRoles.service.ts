import { groupsOfPermissions } from '@modules/permissions/interfaces/permissionsEnum';
import { Injectable } from '@nestjs/common';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

@Injectable()
export class GenerateRolesService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(): Promise<void> {
    Object.keys(groupsOfPermissions).map(async (role) => {
      const permissionsNames = groupsOfPermissions[role];

      const findPermissions = await this.permissionRepository
        .createQueryBuilder('permissions')
        .where('permissions.name IN (:...permissionsNames)', {
          permissionsNames,
        })
        .getMany();

      const roleExists = await this.roleRepository.findOne({
        where: { name: role },
      });

      console.log(roleExists);

      if (!roleExists) {
        const roleSaved = await this.roleRepository.create({
          name: role,
          description: `Grupo de permissões para ${role}`,
        });

        const roleCreated = await this.roleRepository.save(roleSaved);

        await this.roleRepository.update(roleCreated.id, {
          permissions: findPermissions,
        });
      }
    });

    console.log('Finished roles generation');
  }
}
