// dto/query-attendance.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatusEnum } from '../types';
import { Transform } from 'class-transformer';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryAttendanceDto extends IQuery {
  @ApiPropertyOptional({
    description: 'Patient ID',
    type: 'string',
  })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Professional ID',
    type: 'string',
  })
  @IsOptional()
  @IsUUID()
  professionalId?: string;

  @ApiPropertyOptional({
    description: 'Status do atendimento',
    enum: AttendanceStatusEnum,
  })
  @IsOptional()
  @IsEnum(AttendanceStatusEnum)
  status?: AttendanceStatusEnum;

  @ApiPropertyOptional({
    description: 'Status do atendimento',
    enum: AttendanceStatusEnum,
    isArray: true,
  })
  listStatus?: AttendanceStatusEnum[];

  @ApiPropertyOptional({
    description: 'Data inicial',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data final',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
