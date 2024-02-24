import { Injectable } from '@nestjs/common';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import PermissionRepository from '../typeorm/repositories/PermissionRepository';

@Injectable()
export class UpdatePermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository.update(id, updatePermissionDto);
  }
}
