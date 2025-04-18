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

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
  UNKNOWN = 'UNKNOWN',
}

@Entity('patient_allergies')
export class PatientAllergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  @Index()
  patient: Patient;

  @Column()
  allergen: string;

  @Column({
    type: 'enum',
    enum: AllergySeverity,
    default: AllergySeverity.UNKNOWN,
  })
  severity: AllergySeverity;

  @Column({ type: 'text', nullable: true })
  reaction: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Attendance, { nullable: true })
  @JoinColumn()
  @Index()
  reportedDuring: Attendance;

  @ManyToOne(() => Professional, { nullable: true })
  @JoinColumn()
  @Index()
  reportedBy: Professional;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
