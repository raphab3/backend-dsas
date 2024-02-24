import { Injectable } from '@nestjs/common';
import RoleRepository from '../typeorm/repositories/RoleRepository';

@Injectable()
export class FindOneRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  async findOne(id: string): Promise<any> {
    return this.roleRepository.findOne(id);
  }
}
