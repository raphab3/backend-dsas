import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from '../dto/update-role.dto';
import RoleRepository from '../typeorm/repositories/RoleRepository';
import PermissionRepository from '@modules/permissions/typeorm/repositories/PermissionRepository';

@Injectable()
export class UpdateRoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role não encontrada`);
    }

    if (updateRoleDto.permissions) {
      const permissions = await this.permissionRepository.findByNames(
        updateRoleDto.permissions,
      );
      role.permissions = permissions;
    }

    await this.roleRepository.save(role);

    return role;
  }
}
