import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { ExamType } from './exam-type.entity';
import { ExamAttachment } from './exam-attachment.entity';

export enum ExamStatusEnum {
  REQUESTED = 'REQUESTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Entity('exams')
export class Exam {
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

  @ManyToOne(() => ExamType, { nullable: false })
  @JoinColumn({ name: 'exam_type_id' })
  examType: ExamType;

  @Column({ type: 'date' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: ExamStatusEnum,
    default: ExamStatusEnum.REQUESTED,
  })
  status: ExamStatusEnum;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  results: string;

  @Column({ type: 'date', nullable: true })
  resultsDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ExamAttachment, (attachment) => attachment.exam)
  attachments: ExamAttachment[];
}
