import IPermissionRepository from './IPermissionRepository';
import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private ormRepository: Repository<Permission>,
  ) {}

  public async create(data: CreatePermissionDto): Promise<Permission> {
    const permission = this.ormRepository.create(data);
    await this.ormRepository.save(permission);
    return permission;
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const usersCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('users')
      .orderBy('users.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    usersCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      usersCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Permission | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: CreatePermissionDto,
  ): Promise<Permission> {
    const builder = this.ormRepository.createQueryBuilder();
    const permission = await builder
      .update(Permission)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return permission.raw[0];
  }

  public async findByNames(names: string[]): Promise<Permission[]> {
    return this.ormRepository.find({
      where: {
        name: ILike(`%${names}%`),
      },
    });
  }
}

export default PermissionRepository;
