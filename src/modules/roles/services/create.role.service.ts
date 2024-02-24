import { Injectable } from '@nestjs/common';
import RoleRepository from '../typeorm/repositories/RoleRepository';

@Injectable()
export class CreateRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(createRoleDto: any) {
    await this.roleRepository.create(createRoleDto);
  }
}
