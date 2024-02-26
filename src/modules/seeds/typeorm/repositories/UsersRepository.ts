import IUsersRepository from './IUsersRepository';
import { ICreateUser } from '@modules/users/interfaces/ICreateUser';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IUser } from '@modules/users/interfaces/IUser';
import { IUserQuery } from '@modules/users/interfaces/IUserQuery';
import { paginate } from '@shared/utils/Pagination';
import { User } from '../entities/user.entity';
import { IUpdateUser } from '@modules/users/interfaces/IUpdateUser';

@Injectable()
class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  public async create(userData: ICreateUser): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user;
  }

  public async list(query: IUserQuery): Promise<IPaginatedResult<IUser>> {
    let page = 1;
    let perPage = 10;

    const usersCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('users')
      .orderBy('users.created_at', 'DESC');

    const where: Partial<IUserQuery> = {};

    if (query.uuid) {
      where.uuid = query.uuid;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.email) {
      where.email = ILike(`%${query.email}%`);
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    usersCreateQueryBuilder.where(where);

    const result: IPaginatedResult<IUser> = await paginate(
      usersCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<User | undefined> {
    console.log('CHEGOU AQUIIII', id);
    return await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
  }

  public async update(user: IUpdateUser): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async getUserWithRolesAndPermissions(id: string): Promise<IUser> {
    return await this.ormRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .leftJoinAndSelect(
        'users.individual_permissions',
        'individual_permissions',
      )
      .where('users.id = :id', { id })
      .getOne();
  }
}

export default UsersRepository;
