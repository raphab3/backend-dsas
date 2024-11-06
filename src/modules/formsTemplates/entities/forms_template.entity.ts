import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { FormCategory } from '../types';

@Entity('form_templates')
@Index(['name'], { unique: true })
export class FormTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FormCategory,
    default: FormCategory.OTHER,
  })
  category: FormCategory;

  @Column()
  @Index()
  mongoTemplateId: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToMany(() => GroupFormTemplate)
  groups: GroupFormTemplate[];

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
