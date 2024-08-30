import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { IProfessional } from '@modules/professionals/interfaces/IProfessional';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Trainee } from '@modules/trainees/entities/trainee.entity';
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

  @OneToOne(() => PersonSig)
  @JoinColumn({ name: 'person_sig_id' })
  person_sig: PersonSig;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  council: string;

  @ManyToMany(() => Specialty, (specialty) => specialty.professionals)
  @JoinTable({
    name: 'professionals_specialties',
    joinColumns: [{ name: 'professional_id' }],
    inverseJoinColumns: [{ name: 'specialty_id' }],
  })
  specialties: Specialty[];

  @OneToMany(() => Schedule, (schedule) => schedule.professional)
  schedules: Schedule[];

  @ManyToMany(() => Location, (location) => location.professionals, {
    cascade: true,
  })
  @JoinTable({
    name: 'professionals_locations',
    joinColumn: {
      name: 'professional_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'location_id',
      referencedColumnName: 'id',
    },
  })
  locations: Location[];

  @OneToMany(() => Trainee, (trainee) => trainee.supervisor)
  trainees: Trainee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
