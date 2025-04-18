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
import { FormCategory, TemplateType } from '../types';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

@Entity('form_templates')
@Index(['name'])
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

  @Column({
    type: 'enum',
    enum: TemplateType,
    default: TemplateType.FORM,
  })
  type: TemplateType;

  @Column()
  @Index()
  mongoTemplateId: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  is_global: boolean;

  @Index('form_template_location_id_index')
  @Column({ nullable: true })
  location_id: string;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: Location;

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
