import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './CreateAssetDto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  name?: string;
}
