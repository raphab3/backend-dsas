import { HttpException, Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';

@Injectable()
export class CreatePatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly personSigRepository: PersonSigRepository,
  ) {}

  async execute(createPatientDto: CreatePatientDto) {
    const personSig = await this.personSigRepository.findByMatricula(
      createPatientDto.matricula,
    );

    if (!personSig) {
      throw new HttpException(
        {
          message: 'Servidor não encontrado',
        },
        404,
      );
    }

    await this.patientRepository.create({
      person_sig_id: personSig.id,
      dependent_id: createPatientDto.dependent_id
        ? createPatientDto.dependent_id
        : null,
    });
  }
}
