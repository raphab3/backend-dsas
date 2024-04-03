'use client';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import UsersRepository from '@modules/users/typeorm/repositories/UsersRepository';
import { CreateUsersService } from '@modules/users/services/create.users.service';
import { DataSource } from 'typeorm';
import { FindExternalSigpmpbService } from './findExternal.sigpmpb.service';
import { gerarProximaMatricula } from '@shared/utils/matriculaTools';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IPersonSig, Origin, OriginType } from '../interfaces/IPersonSig';

interface IRequest {
  matricula?: string;
  nome?: string;
  email?: string;
  ddd?: string;
  telefone?: string;
  cpf?: string;
  sexo?: string;
  nome_guerra?: string;
  tipo_servidor?: OriginType;
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
    if (!data.tipo_servidor) {
      return new HttpException('O tipo do servidor é obrigatório', 400);
    }

    return await this.handleOriginType(data);
  }

  private async handleOriginType(
    data: IRequest,
  ): Promise<IPersonSig | HttpException> {
    switch (data.tipo_servidor) {
      case Origin.PMPB:
      case Origin.CBMPB:
        return this.createOrUpdatePersonSig(data, true);
      case Origin.FUNCIONARIO_CIVIL:
      case Origin.CIVIL:
        return this.createOrUpdatePersonSig(data);
      default:
        return new HttpException('Tipo servidor inválido', 400);
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
        return new HttpException(
          'Matricula is required for PMPB/CBMPB origin',
          400,
        );
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

        const tipoServidorEsperado = {
          PMPB: 'POLICIAL MILITAR',
          CBMPB: 'BOMBEIRO MILITAR',
        };

        if (
          personSig.tipo_servidor !== tipoServidorEsperado[data.tipo_servidor]
        ) {
          throw new HttpException(
            `Esse servidor não é ${data.tipo_servidor}`,
            400,
          );
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
        tipo_servidor: data.tipo_servidor,
      });

      await this.createUserForPersonSig(personSigInSystem);

      return personSigInSystem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, 400);
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
        (
          await this.personSigRepository.findLastMatriculaByOrigin(
            data.tipo_servidor,
          )
        )?.matricula,
      );

    return {
      matricula,
      nome: data.nome,
      email: data.email,
      ddd: data.ddd,
      telefone: data.telefone,
      cpf: data.cpf,
      sexo: data.sexo,
      nome_guerra: data.nome.split(' ')[0],
      tipo_servidor: data.tipo_servidor,
    } as IPersonSig;
  }

  private async createUserForPersonSig(personSig: IPersonSig): Promise<void> {
    const userSaved = await this.createUsersService.execute({
      email: personSig.email,
      name: personSig.nome,
      password: personSig.cpf,
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
