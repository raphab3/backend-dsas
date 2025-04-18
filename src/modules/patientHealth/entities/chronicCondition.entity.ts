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

export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  INACTIVE = 'INACTIVE',
  RECURRENT = 'RECURRENT',
  UNKNOWN = 'UNKNOWN',
}

@Entity('patient_chronic_conditions')
export class ChronicCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  @Index()
  patient: Patient;

  @Column()
  condition: string;

  @Column({
    type: 'enum',
    enum: ConditionStatus,
    default: ConditionStatus.ACTIVE,
  })
  status: ConditionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  diagnosedAt: Date;

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
