import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('specialties')
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.specialty)
  schedules: Schedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
