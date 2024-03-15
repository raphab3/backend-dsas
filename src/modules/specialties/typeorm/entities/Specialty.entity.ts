import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { FormationEnum } from '@modules/specialties/interfaces/ISpecialty';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @Column({
    type: 'enum',
    enum: FormationEnum,
    nullable: true,
  })
  formation: FormationEnum;

  @OneToMany(() => Schedule, (schedule) => schedule.specialty)
  schedules: Schedule[];

  @ManyToMany(() => Professional, (professional) => professional.specialties)
  professionals: Professional[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  ensureNameIsUppercase() {
    console.log('ensureNameIsUppercase');
    this.name = this.name.toUpperCase();
  }
}
