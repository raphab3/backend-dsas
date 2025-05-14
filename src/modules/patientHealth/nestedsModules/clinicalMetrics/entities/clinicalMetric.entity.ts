import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

export enum MetricType {
  VITAL_SIGN = 'VITAL_SIGN',
  LAB_RESULT = 'LAB_RESULT',
  ALLERGY = 'ALLERGY',
  MEDICATION = 'MEDICATION',
  CONDITION = 'CONDITION',
  PROCEDURE = 'PROCEDURE',
  MEASUREMENT = 'MEASUREMENT',
  OBSERVATION = 'OBSERVATION',
}

@Entity('clinical_metrics')
export class ClinicalMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  @Index()
  patient: Patient;

  @ManyToOne(() => Professional, { nullable: true })
  @JoinColumn()
  @Index()
  professional: Professional;

  @ManyToOne(() => Attendance, { nullable: true })
  @JoinColumn()
  @Index()
  attendance: Attendance;

  @Column({
    type: 'enum',
    enum: MetricType,
  })
  @Index()
  type: MetricType;

  @Column()
  @Index()
  code: string;

  @Column()
  name: string;

  @Column('jsonb')
  value: any;

  @Column('jsonb', { nullable: true })
  metadata: {
    unit?: string;
    referenceRange?: {
      min?: number;
      max?: number;
      criticalMin?: number;
      criticalMax?: number;
    };
    precision?: number;
    severity?: string;
    status?: string;
    alert?: 'WARNING' | 'CRITICAL';
    alertMessage?: string;
    measurementContext?: {
      situation?: string;
      location?: string;
      method?: string;
      deviceType?: string;
      [key: string]: any;
    };
    interpretation?: Record<string, string>;
    [key: string]: any;
  };

  @CreateDateColumn()
  @Index()
  measuredAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  source: {
    type: string;
    id: string;
    field?: string;
    session?: string;
    formTemplate?: string;
  };
}
