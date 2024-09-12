import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trainees')
export class Trainee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  birthday: Date;

  @Column({
    type: 'enum',
    enum: ['M', 'F'],
    nullable: true,
  })
  gender: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  cpf: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({
    type: 'varchar',
  })
  institution: string;

  @Column({
    type: 'varchar',
  })
  course: string;

  @Column({
    type: 'integer',
  })
  semester: number;

  @ManyToOne(() => Professional, (professional) => professional.trainees)
  supervisor: Professional;

  @OneToMany(() => Schedule, (schedule) => schedule.trainee)
  schedules: Schedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
