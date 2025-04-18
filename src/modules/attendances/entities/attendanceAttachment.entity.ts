import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';
import Attachment from '@modules/attachments/entities/Attachment';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';

@Entity('attendance_attachments')
export class AttendanceAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Attendance, (attendance) => attendance.attendanceAttachments)
  @JoinColumn()
  attendance: Attendance;

  @ManyToOne(() => Attachment)
  @JoinColumn()
  attachment: Attachment;

  @ManyToOne(() => PersonSig, { nullable: true })
  @JoinColumn()
  uploadedBy: PersonSig;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
