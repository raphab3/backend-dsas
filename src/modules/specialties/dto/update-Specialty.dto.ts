import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialtyDto } from './create-Specialty.dto';

export class UpdateSpecialtyDto extends PartialType(CreateSpecialtyDto) {
  name?: string;
}
