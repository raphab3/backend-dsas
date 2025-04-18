import { PartialType } from '@nestjs/mapped-types';
import { CreateChronicConditionDto } from './create-chronic-condition.dto';

export class UpdateChronicConditionDto extends PartialType(
  CreateChronicConditionDto,
) {}
