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
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { AttendanceStatusEnum } from '../types';
import { format } from 'date-fns';
import { ClinicalMetric } from '@modules/clinicalMetrics/entities/clinicalMetric.entity';

@Entity('attendances')
@Index('IDX_UNIQUE_CODE', ['code'], { unique: true })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @Column({ type: 'timestamptz', nullable: true })
  @Index()
  endAttendance: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatusEnum,
    default: AttendanceStatusEnum.IN_PROGRESS,
  })
  status: AttendanceStatusEnum;

  @Column('simple-array', { nullable: true })
  formResponseIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  summary?: {
    mainComplaints?: string[];
    diagnosis?: string[];
    procedures?: string[];
    recommendations?: string[];
    metricsProcessed?: number;
    metricsWithAlerts?: number;
    [key: string]: any;
  };

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

  @OneToMany(() => ClinicalMetric, (metric) => metric.attendance)
  clinicalMetrics: ClinicalMetric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateCode() {
    const now = new Date();
    this.code = `ATD${format(now, 'yyyyMMddHHmmssSSS')}`;
  }
}
