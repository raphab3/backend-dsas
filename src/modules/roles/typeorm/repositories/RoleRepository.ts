import IRoleRepository from './IRoleRepository';
import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';

@Injectable()
class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private ormRepository: Repository<Role>,
  ) {}

  public async create(data: CreateRoleDto): Promise<Role> {
    const role = this.ormRepository.create(data);
    await this.ormRepository.save(role);
    return role;
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const rolesCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .orderBy('roles.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    rolesCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      rolesCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findByName(name: string): Promise<Role | undefined> {
    return await this.ormRepository
      .createQueryBuilder('roles')
      .where('name = :name', { name })
      .getOne();
  }

  public async findByNames(roleNames: string[]): Promise<Role[]> {
    const roles = await this.ormRepository
      .createQueryBuilder()
      .where('name IN (:...roleNames)', { roleNames })
      .getMany();

    return roles;
  }

  public async findByIds(ids: string[]): Promise<Role[]> {
    return this.ormRepository
      .createQueryBuilder('roles')
      .where('id IN (:...ids)', { ids })
      .getMany();
  }

  public async findOne(id: string): Promise<Role | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['permissions'],
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: CreateRoleDto): Promise<Role> {
    const builder = this.ormRepository.createQueryBuilder();
    const role = await builder
      .update(Role)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return role.raw[0];
  }

  public async addPermissions(
    role: Role,
    permissions: Permission[],
  ): Promise<Role> {
    role.permissions = permissions;
    return this.ormRepository.save(role);
  }

  public async save(role: Role): Promise<Role> {
    return this.ormRepository.save(role);
  }
}

export default RoleRepository;
