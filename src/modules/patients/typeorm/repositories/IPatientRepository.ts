import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '../entities/patient.entity';

export default interface IPatientRepository {
  create(data: CreatePatientDto): Promise<Patient>;
  list(): Promise<Patient[]>;
  findOne(id: string): Promise<Patient | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreatePatientDto): Promise<Patient>;
}
