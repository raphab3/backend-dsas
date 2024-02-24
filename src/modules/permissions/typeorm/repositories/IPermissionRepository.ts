import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { Permission } from '../entities/permission.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IPermissionRepository {
  create(data: CreatePermissionDto): Promise<Permission>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Permission | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreatePermissionDto): Promise<Permission>;
  findByNames(names: string[]): Promise<Permission[]>;
}
