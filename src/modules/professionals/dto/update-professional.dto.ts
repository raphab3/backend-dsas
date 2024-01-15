import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from './create-professional.dto';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  crm?: string;
  user_id?: string;
  person_sig_id?: string;
  specialties?: Partial<Specialty>[];
}
