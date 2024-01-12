import IUsersRepository from './IUsersRepository';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IUser } from '@modules/users/interfaces/user.interface';
import { paginate } from '@shared/utils/Pagination';
import { IUserQuery } from '@modules/users/interfaces/IUserQuery';

@Injectable()
class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  public async create(userData: CreateUserDto): Promise<User> {
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
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }
}

export default UsersRepository;
