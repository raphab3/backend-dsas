import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exam } from './exam.entity';

@Entity('exam_attachments')
export class ExamAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exam, { nullable: false })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column()
  fileKey: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
