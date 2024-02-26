import { HttpException, Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import { FindExternalSigpmpbService } from './findExternal.sigpmpb.service';
import { IPersonSig } from '../interfaces/IPersonSig';
import { CreateUsersService } from '@modules/users/services/create.users.service';

@Injectable()
export class CreatePersonSigService {
  constructor(
    private readonly personSigRepository: PersonSigRepository,
    private readonly findExternalSigpmpbService: FindExternalSigpmpbService,
    private readonly createUsersService: CreateUsersService,
  ) {}

  async execute(matricula: string): Promise<IPersonSig | HttpException> {
    if (!matricula) {
      return new HttpException('Matricula is required', 400);
    }

    const personSigExists =
      await this.personSigRepository.matriculaExists(matricula);

    if (!personSigExists) {
      const personSig = await this.findExternalSigpmpbService
        .execute(matricula)
        .catch((error) => {
          console.log('FIND_EXTERNAL_SIGPMPB_SERVICE_ERROR', error);
          return null;
        });

      if (personSig) {
        const personSigInSystem =
          await this.personSigRepository.create(personSig);
        if (personSigInSystem) {
          const userSaved = await this.createUsersService.execute({
            email: personSigInSystem.email,
            name: personSigInSystem.nome,
            password: personSigInSystem.cpf,
            roles: ['user'],
          });

          if (userSaved) {
            await this.personSigRepository.update(personSigInSystem.id, {
              user: {
                id: userSaved.id,
              },
            });
          }
        }
      }
    } else {
      return new HttpException('Matrícula já existe', 409);
    }
  }
}
