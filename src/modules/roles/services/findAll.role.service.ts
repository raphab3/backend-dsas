import { Injectable } from '@nestjs/common';
import RoleRepository from '../typeorm/repositories/RoleRepository';

@Injectable()
export class FindAllRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(query: any): Promise<any> {
    return this.roleRepository.list(query);
  }
}
