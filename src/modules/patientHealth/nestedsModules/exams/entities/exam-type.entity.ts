import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExamCategoryEnum {
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  CARDIOLOGY = 'CARDIOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  OTHER = 'OTHER',
}

@Entity('exam_types')
export class ExamType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ExamCategoryEnum,
    default: ExamCategoryEnum.OTHER,
  })
  category: ExamCategoryEnum;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
