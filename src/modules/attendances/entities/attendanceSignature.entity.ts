import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Attendance } from './attendance.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { Certificate } from '@modules/DigitalSignatures/entities/certificate.entity';

export enum AttendanceSignatureStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  REVOKED = 'revoked',
}

@Entity('attendance_signatures')
export class AttendanceSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Attendance)
  @JoinColumn({ name: 'attendance_id' })
  @Index()
  attendance: Attendance;

  @Column({ name: 'attendance_id' })
  attendance_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => Certificate)
  @JoinColumn({ name: 'certificate_id' })
  @Index()
  certificate: Certificate;

  @Column({ name: 'certificate_id' })
  certificate_id: string;

  @Column({ type: 'int', default: 0 })
  page: number;

  @Column({ type: 'float', default: 0 })
  position_x: number;

  @Column({ type: 'float', default: 0 })
  position_y: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  signature_data: string;

  @Column({
    type: 'enum',
    enum: AttendanceSignatureStatus,
    default: AttendanceSignatureStatus.VALID,
  })
  status: AttendanceSignatureStatus;

  @Column({ type: 'text', nullable: true })
  s3_location: string;

  @Column({ type: 'text', nullable: true })
  @Index()
  verification_code: string;

  @Column({ type: 'timestamptz' })
  signed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
