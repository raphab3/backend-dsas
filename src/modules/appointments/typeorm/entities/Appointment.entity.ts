import {
  IAppointment,
  StatusAppointmentType,
  statusAppointmentOfTypeEnum,
} from '@modules/appointments/interfaces/IAppointment';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['schedule', 'patient'])
@Entity('appointments')
export class Appointment implements IAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  schedule: Schedule;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @Column({
    type: 'enum',
    enum: [...statusAppointmentOfTypeEnum],
    default: 'scheduled',
  })
  status: StatusAppointmentType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
