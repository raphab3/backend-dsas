import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonSigDto } from './create-personSig.dto';

export class UpdatePersonSigDto extends PartialType(CreatePersonSigDto) {
  name?: string;
  user?: { id: string };
}
