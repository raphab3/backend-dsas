import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';
import { Role } from '../entities/role.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';

export default interface IRoleRepository {
  create(data: CreateRoleDto): Promise<Role>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findByNames(roleNames: string[]): Promise<Role[]>;
  findOne(id: string): Promise<Role | undefined>;
  findByName(name: string): Promise<Role | undefined>;
  findByNames(roleNames: string[]): Promise<Role[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateRoleDto): Promise<Role>;
  addPermissions(role: Role, permissions: Permission[]): Promise<Role>;
}
