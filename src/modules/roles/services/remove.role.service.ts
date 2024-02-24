import { Injectable } from '@nestjs/common';
import RoleRepository from '../typeorm/repositories/RoleRepository';

@Injectable()
export class RemoveRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  remove(id: string) {
    return this.roleRepository.delete(id);
  }
}
