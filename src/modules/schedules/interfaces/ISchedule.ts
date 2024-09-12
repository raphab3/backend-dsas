import { ILocation } from '@modules/locations/interfaces/ILocation';
import { IProfessional } from '@modules/professionals/interfaces/IProfessional';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';
import { Expose, Type } from 'class-transformer';

export interface ISchedule {
  id: string;
  code: number;
  description?: string;
  available_date?: string;
  start_time?: string;
  end_time?: string;
  max_patients?: number;
  patients_attended?: number;
  status?: boolean;
  professional?: Partial<IProfessional>;
  specialty?: Partial<ISpecialty>;
  location?: Partial<ILocation>;
  trainee?: Partial<IProfessional>;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateSchedule
  extends Omit<
    ISchedule,
    'id' | 'created_at' | 'updated_at' | 'code' | 'status' | 'patients_attended'
  > {}

export interface IUpdateSchedule
  extends Omit<
    ISchedule,
    'id' | 'created_at' | 'updated_at' | 'code' | 'status'
  > {}

class PersonSigDto {
  @Expose() id: string;
  @Expose() patente: string;
  @Expose() nome: string;
  @Expose() funcao: string;
  @Expose() nome_guerra: string;
  @Expose() matricula: string;
  @Expose() tipo_servidor: string;
}

class ProfessionalDto {
  @Expose() id: string;
  @Expose() council: string;
  @Expose() @Type(() => PersonSigDto) person_sig: PersonSigDto;
}

class SpecialtyDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() formation: string;
}

class LocationDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() city: string;
  @Expose() schedule_enabled: boolean;
}

class TraineeDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() created_at: Date;
  @Expose() updated_at: Date;
}

export class ScheduleDto {
  @Expose() id: string;
  @Expose() code: number;
  @Expose() description?: string;
  @Expose() available_date?: string;
  @Expose() start_time?: string;
  @Expose() end_time?: string;
  @Expose() max_patients?: number;
  @Expose() patients_attended?: number;
  @Expose() status?: boolean;
  @Expose() created_at: Date;
  @Expose() updated_at: Date;

  @Expose() @Type(() => TraineeDto) trainee?: TraineeDto;
  @Expose() @Type(() => ProfessionalDto) professional?: ProfessionalDto;
  @Expose() @Type(() => SpecialtyDto) specialty?: SpecialtyDto;
  @Expose() @Type(() => LocationDto) location?: LocationDto;
}

export class ScheduleEndUserDto {
  @Expose() id: string;
  @Expose() code: number;
  @Expose() description?: string;
  @Expose() available_date?: string;
  @Expose() start_time?: string;
  @Expose() end_time?: string;
  @Expose() max_patients?: number;
  @Expose() patients_attended?: number;
  @Expose() status?: boolean;
  @Expose() created_at: Date;
  @Expose() updated_at: Date;
}

class PaginationDto {
  @Expose() total: number;
  @Expose() per_page: number;
  @Expose() total_pages: number;
  @Expose() current_page: number;
}

export class ScheduleResponseDto {
  @Expose()
  @Type(() => ScheduleDto)
  data: ScheduleDto[];

  @Expose()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}

export class ScheduleEndUserResponseDto {
  @Expose()
  @Type(() => ScheduleEndUserDto)
  data: ScheduleEndUserDto[];

  @Expose()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
