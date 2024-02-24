import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';
import { Role } from '../entities/role.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IRoleRepository {
  create(data: CreateRoleDto): Promise<Role>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findByNames(roleNames: string[]): Promise<Role[]>;
  findOne(id: string): Promise<Role | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateRoleDto): Promise<Role>;
}
