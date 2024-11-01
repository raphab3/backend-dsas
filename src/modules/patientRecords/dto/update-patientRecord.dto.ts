import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientRecordDto } from './create-patientRecord.dto';

export class UpdatePatientRecordDto extends PartialType(CreatePatientRecordDto) {
  name?: string;
}
