import { Injectable } from '@nestjs/common';
import PermissionRepository from '../typeorm/repositories/PermissionRepository';

@Injectable()
export class CreatePermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(createPermissionDto: any) {
    await this.permissionRepository.create(createPermissionDto);
  }
}
