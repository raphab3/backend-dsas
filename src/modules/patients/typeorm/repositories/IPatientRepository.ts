import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '../entities/patient.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { ICreatePatient } from '@modules/patients/interfaces/ICreatePatient';
import { IQueryPatients } from '@modules/patients/interfaces/IQueryPatients';

export default interface IPatientRepository {
  create(data: ICreatePatient): Promise<Patient>;
  list(query: IQueryPatients): Promise<IPaginatedResult<Patient>>;
  findOne(id: string): Promise<Patient | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreatePatientDto): Promise<Patient>;
  findByMatricula(matricula: string): Promise<Patient | undefined>;
  findByDependentId(dependent_id: string): Promise<Patient | undefined>;
  findPatientByPersonIdWithoutDependent(
    person_sig_id: string,
  ): Promise<Patient | undefined>;
}
