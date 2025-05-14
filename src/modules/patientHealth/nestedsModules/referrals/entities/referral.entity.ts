import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

export enum ReferralPriorityEnum {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
}

export enum ReferralStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Attendance, { nullable: false })
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Professional, { nullable: false })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @ManyToOne(() => Specialty, { nullable: false })
  @JoinColumn({ name: 'target_specialty_id' })
  targetSpecialty: Specialty;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'target_location_id' })
  targetLocation: Location;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  clinicalObservations: string;

  @Column({
    type: 'enum',
    enum: ReferralPriorityEnum,
    default: ReferralPriorityEnum.NORMAL,
  })
  priority: ReferralPriorityEnum;

  @Column({
    type: 'enum',
    enum: ReferralStatusEnum,
    default: ReferralStatusEnum.PENDING,
  })
  status: ReferralStatusEnum;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
