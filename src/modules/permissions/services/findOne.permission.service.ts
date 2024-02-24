import { Injectable } from '@nestjs/common';
import PermissionRepository from '../typeorm/repositories/PermissionRepository';

@Injectable()
export class FindOnePermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  async findOne(id: string): Promise<any> {
    return this.permissionRepository.findOne(id);
  }
}
