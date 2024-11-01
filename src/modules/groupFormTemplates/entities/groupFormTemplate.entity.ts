import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('group_form_templates')
export class GroupFormTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'boolean',
  })
  isActive: boolean;

  @ManyToMany(() => FormTemplate)
  @JoinTable({
    name: 'group_template_associations',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'template_id',
      referencedColumnName: 'id',
    },
  })
  templates: FormTemplate[];

  @OneToMany(() => Attendance, (attendance) => attendance.groupFormTemplate)
  attendances: Attendance[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'group_role_associations',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => Specialty)
  @JoinTable({
    name: 'group_specialty_associations',
    joinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialty_id',
      referencedColumnName: 'id',
    },
  })
  specialties: Specialty[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
