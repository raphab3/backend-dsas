import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
