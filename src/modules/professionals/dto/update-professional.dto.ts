import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from './create-professional.dto';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  id: string;
  council?: string;
  person_sig_id?: string;
  specialties?: Partial<Specialty>[];
  locations?: Partial<Location>[];
}
