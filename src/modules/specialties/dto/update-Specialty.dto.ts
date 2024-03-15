import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialtyDto } from './create-Specialty.dto';
import { FormationEnum } from '../interfaces/ISpecialty';

export class UpdateSpecialtyDto extends PartialType(CreateSpecialtyDto) {
  name?: string;
  formation?: FormationEnum;
}
