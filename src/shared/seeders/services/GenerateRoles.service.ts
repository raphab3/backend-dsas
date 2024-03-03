import { groupsOfPermissions } from '@modules/permissions/interfaces/permissionsEnum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

@Injectable()
export class GenerateRolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(): Promise<void> {
    Object.keys(groupsOfPermissions).map(async (role) => {
      console.log('role selected', role);

      const roleExists = await this.roleRepository.findOne({
        where: { name: role },
      });

      console.log('roleExists', !!roleExists);

      if (!roleExists) {
        const roleSaved = this.roleRepository.create({
          name: role,
          description: `Grupo de permissões para ${role}`,
        });

        await this.roleRepository.save(roleSaved);
        console.log('role saved', !!roleSaved);
      }

      console.log('role created');
    });

    console.log('Finished roles generation');
  }
}
