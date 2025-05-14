import { PartialType } from '@nestjs/swagger';
import { AnamnesisDto } from './create-medical-record.dto';

export class UpdateMedicalRecordDto extends PartialType(AnamnesisDto) {}
