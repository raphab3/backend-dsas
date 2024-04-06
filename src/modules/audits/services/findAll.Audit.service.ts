import { HttpException, Injectable } from '@nestjs/common';
import AuditRepository from '../typeorm/repositories/AuditRepository';
import { IQueryAudit } from '../dto/IQueryAudit';
import UsersRepository from '@modules/users/typeorm/repositories/UsersRepository';

@Injectable()
export class FindAllAuditService {
  constructor(
    private readonly auditRepository: AuditRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async findAll(query: IQueryAudit): Promise<any> {
    if (query.matricula) {
      const user = await this.userRepository.list({
        matricula: query.matricula,
      });

      if (!user) {
        throw new HttpException('Servidor não encontrado', 404);
      }

      query.userId = user.data[0].id;
    }
    return this.auditRepository.list(query);
  }
}
