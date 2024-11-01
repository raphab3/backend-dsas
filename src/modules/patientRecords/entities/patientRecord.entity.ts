import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patient_records')
export class PatientRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'enum',
  //   enum: RecordTypeEnum,
  //   default: RecordTypeEnum.CONSULTATION,
  // })
  // recordType: RecordTypeEnum;

  @Column({ nullable: true })
  notes: string;

  @Column('simple-array', { nullable: true })
  formResponseIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Patient)
  patient: Patient;

  @ManyToOne(() => Professional)
  professional: Professional;

  @ManyToOne(() => Attendance)
  attendance: Attendance;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
