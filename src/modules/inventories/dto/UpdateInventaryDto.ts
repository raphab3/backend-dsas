import { PartialType } from '@nestjs/mapped-types';
import { CreateInventaryDto } from './CreateInventaryDto';

export class UpdateInventaryDto extends PartialType(CreateInventaryDto) {
  name?: string;
}
