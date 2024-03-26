'use client';
import { HttpException, Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import { FindExternalSigpmpbService } from './findExternal.sigpmpb.service';
import { IPersonSig, Origin, OriginType } from '../interfaces/IPersonSig';
import { CreateUsersService } from '@modules/users/services/create.users.service';
import { gerarProximaMatricula } from '@shared/utils/matriculaTools';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UsersRepository from '@modules/users/typeorm/repositories/UsersRepository';
import { randomUUID } from 'crypto';

interface IRequest {
  matricula?: string;
  nome?: string;
  email?: string;
  ddd?: string;
  telefone?: string;
  cpf?: string;
  sexo?: string;
  nome_guerra?: string;
  origem?: OriginType;
}

@Injectable()
export class CreatePersonSigService {
  constructor(
    private readonly personSigRepository: PersonSigRepository,
    private readonly findExternalSigpmpbService: FindExternalSigpmpbService,
    private readonly createUsersService: CreateUsersService,
    private readonly usersRepository: UsersRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async execute(data: IRequest): Promise<IPersonSig | HttpException> {
    if (!data.origem) {
      return new HttpException('A origem do servidor é obrigatório', 400);
    }

    return await this.handleOriginType(data);
  }

  private async handleOriginType(
    data: IRequest,
  ): Promise<IPersonSig | HttpException> {
    switch (data.origem) {
      case Origin.PMPB:
        return this.createOrUpdatePersonSig(data, true);
      case Origin.FUNCIONARIO_CIVIL:
      case Origin.CIVIL:
        return this.createOrUpdatePersonSig(data);
      default:
        return new HttpException('Origem inválida', 400);
    }
  }

  private async createOrUpdatePersonSig(
    data: IRequest,
    isExternal: boolean = false,
  ): Promise<IPersonSig | HttpException> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists && !isExternal) {
      return new HttpException('Email já cadastrado', 409);
    }

    try {
      if (isExternal && !data.matricula) {
        return new HttpException('Matricula is required for PMPB origin', 400);
      }

      let personSig: IPersonSig;
      if (isExternal) {
        personSig = await this.findExternalPersonSig(data.matricula);
        if (!personSig) {
          return new HttpException(
            'External service error or person not found',
            404,
          );
        }

        if (personSig.email == '0' || !personSig.email) {
          personSig.email = generateEmail();
        }
      } else {
        personSig = await this.constructPersonSig(data);
      }

      const personSigExists = await this.personSigRepository.matriculaExists(
        personSig.matricula,
      );

      if (personSigExists) {
        return new HttpException('Matrícula já existe', 409);
      }

      const personSigInSystem = await this.personSigRepository.create({
        ...personSig,
      });

      await this.createUserForPersonSig(personSigInSystem);

      return personSigInSystem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('Erro ao criar servidor', 500);
    } finally {
      await queryRunner.release();
    }
  }

  private async findExternalPersonSig(
    matricula: string,
  ): Promise<IPersonSig | null> {
    return this.findExternalSigpmpbService.execute(matricula).catch((error) => {
      console.log('FIND_EXTERNAL_SIGPMPB_SERVICE_ERROR', error);
      return null;
    });
  }

  private async constructPersonSig(data: IRequest): Promise<IPersonSig> {
    const matricula =
      data.matricula ||
      gerarProximaMatricula(
        (await this.personSigRepository.findLastMatriculaByOrigin(data.origem))
          ?.matricula,
      );

    console.log('matricula', matricula);
    return {
      matricula,
      nome: data.nome,
      email: data.email,
      ddd: data.ddd,
      telefone: data.telefone,
      cpf: data.cpf,
      sexo: data.sexo,
      nome_guerra: data.nome.split(' ')[0],
      origem: data.origem,
    } as IPersonSig;
  }

  private async createUserForPersonSig(personSig: IPersonSig): Promise<void> {
    const userSaved = await this.createUsersService.execute({
      email: personSig.email,
      name: personSig.nome,
      password: personSig.cpf, // Assuming password is being hashed inside the service
      roles: ['user'],
    });

    if (userSaved) {
      await this.personSigRepository.update(personSig.id, {
        user: {
          id: userSaved.id,
        },
      });
    }
  }
}

function generateEmail() {
  return `${randomUUID()}@mail.com`;
}
