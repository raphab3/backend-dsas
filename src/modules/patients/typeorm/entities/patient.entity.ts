import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Dependent } from '@modules/dependents/typeorm/entities/dependent.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { VitalSigns } from '@modules/VitalSigns/entities/VitalSigns.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['person_sig', 'dependent'])
@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PersonSig)
  @JoinColumn()
  person_sig: PersonSig;

  @ManyToOne(() => Dependent, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  dependent: Dependent;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => VitalSigns, (vitalSigns) => vitalSigns.patient)
  vitalSings: VitalSigns[];

  // @OneToMany(() => Document, (Document) => Document.patient)
  // documents: Document[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
