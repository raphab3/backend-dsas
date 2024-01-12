import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
  })
  crm: string;

  @ManyToMany(() => Specialty)
  @JoinTable({
    name: 'professionals_specialties',
    joinColumns: [{ name: 'professional_id' }],
    inverseJoinColumns: [{ name: 'specialty_id' }],
  })
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
