import { Injectable } from '@nestjs/common';
import PermissionRepository from '../typeorm/repositories/PermissionRepository';

@Injectable()
export class RemovePermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  remove(id: string) {
    return this.permissionRepository.delete(id);
  }
}
