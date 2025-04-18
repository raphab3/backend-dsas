import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';

@Injectable()
export class PersonSigGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.person_sig', 'person_sig')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user?.person_sig?.id) {
      throw new UnauthorizedException('Usuário não possui PersonSig associado');
    }

    request.personSigId = user.person_sig.id;

    return true;
  }
}
