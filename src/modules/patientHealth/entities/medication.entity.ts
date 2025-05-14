import { Attendance } from '@modules/attendances/entities/attendance.entity';
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
} from 'typeorm';

export enum MedicationFrequency {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',
  EVERY_MORNING = 'EVERY_MORNING',
  EVERY_NIGHT = 'EVERY_NIGHT',
  AS_NEEDED = 'AS_NEEDED',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  OTHER = 'OTHER',
}

export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  COMPLETED = 'COMPLETED',
}

@Entity('patient_medications')
export class PatientMedication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  @Index()
  patient: Patient;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({
    type: 'enum',
    enum: MedicationFrequency,
    default: MedicationFrequency.ONCE_DAILY,
  })
  frequency: MedicationFrequency;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  instructions: string;

  @Column({
    type: 'enum',
    enum: MedicationStatus,
    default: MedicationStatus.ACTIVE,
  })
  status: MedicationStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Attendance, { nullable: true })
  @JoinColumn()
  @Index()
  reportedDuring: Attendance;

  @ManyToOne(() => Professional, { nullable: true })
  @JoinColumn()
  @Index()
  prescribedBy: Professional;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
