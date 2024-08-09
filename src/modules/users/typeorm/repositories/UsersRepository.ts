import IUsersRepository from './IUsersRepository';
import { ICreateUser } from '@modules/users/interfaces/ICreateUser';
import { Repository } from 'typeorm';
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
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.person_sig', 'person_sig')
      .leftJoinAndSelect('person_sig.locations', 'locations')
      .orderBy('user.created_at', 'DESC');

    if (query.id) {
      usersCreateQueryBuilder.andWhere('user.id = :id', { id: query.id });
    }

    if (query.userId) {
      usersCreateQueryBuilder.andWhere('user.userId ILike :userId', {
        userId: `%${query.userId}%`,
      });
    }

    if (query.name) {
      usersCreateQueryBuilder.andWhere('user.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.email) {
      usersCreateQueryBuilder.andWhere('user.email ILike :email', {
        email: `%${query.email}%`,
      });
    }

    if (query.role) {
      usersCreateQueryBuilder.andWhere('roles.name ILike :role', {
        role: `%${query.role}%`,
      });
    }

    if (query.role_id) {
      usersCreateQueryBuilder.andWhere('roles.id = :role_id', {
        role_id: query.role_id,
      });
    }

    if (query.location_id) {
      usersCreateQueryBuilder.andWhere('locations.id = :location_id', {
        location_id: query.location_id,
      });
    }

    if (query.matricula) {
      usersCreateQueryBuilder.andWhere(
        'person_sig.matricula ILike :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

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
    try {
      const user = await this.ormRepository.findOne({
        where: { id },
        relations: [
          'roles',
          'roles.permissions',
          'individual_permissions',
          'person_sig',
          'person_sig.locations',
        ],
      });

      return user;
    } catch (error) {
      console.log('error', error);
    }
  }

  public async update(user: IUpdateUser): Promise<User> {
    const userBuilder = await this.ormRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!userBuilder) {
      throw new Error('user not found');
    }

    Object.assign(userBuilder, user);
    await this.ormRepository.save(userBuilder);

    return userBuilder;
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
