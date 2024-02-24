import { Injectable } from '@nestjs/common';
import PermissionRepository from '../typeorm/repositories/PermissionRepository';

@Injectable()
export class FindAllPermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findAll(query: any): Promise<any> {
    return this.permissionRepository.list(query);
  }
}
