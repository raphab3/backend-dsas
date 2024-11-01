import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Generated,
} from 'typeorm';
import { AttendanceStatusEnum } from '../types';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Generated('increment')
  @Column({
    type: 'varchar',
    length: 10,
  })
  @Index()
  code: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  @Index()
  patient: Patient;

  @ManyToOne(() => Professional)
  @JoinColumn()
  @Index()
  professional: Professional;

  @Column({ type: 'timestamptz' })
  @Index()
  startAttendance: Date;

  @Column({ type: 'timestamptz' })
  @Index()
  endAttendance: Date;

  //Add audit attendance status

  @Column({
    type: 'enum',
    enum: AttendanceStatusEnum,
    default: AttendanceStatusEnum.IN_PROGRESS,
  })
  status: AttendanceStatusEnum;

  @Column('simple-array', { nullable: true })
  formResponseIds: string[];

  @ManyToOne(() => Appointment, (appointment) => appointment.attendances, {
    nullable: true,
  })
  appointment: Appointment;

  @ManyToOne(
    () => GroupFormTemplate,
    (groupFormTemplate) => groupFormTemplate.attendances,
    {
      nullable: true,
    },
  )
  groupFormTemplate: GroupFormTemplate;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
