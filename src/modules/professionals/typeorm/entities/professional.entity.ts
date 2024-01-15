import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { IProfessional } from '@modules/professionals/interfaces/IProfessional';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('professionals')
export class Professional implements IProfessional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => PersonSig)
  @JoinColumn({ name: 'person_sig_id' })
  person_sig: PersonSig;

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
  specialties: Specialty[];

  @OneToMany(() => Schedule, (schedule) => schedule.professional)
  schedules: Schedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
