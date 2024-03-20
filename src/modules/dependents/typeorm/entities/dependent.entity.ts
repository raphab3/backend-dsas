import {
  DegreeOfKinshipEnuns,
  DegreeOfKinshipType,
  IDependent,
} from '@modules/dependents/interfaces/IDependent';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dependents')
export class Dependent implements IDependent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: [...DegreeOfKinshipEnuns] })
  degree_of_kinship: DegreeOfKinshipType;

  @Column({ type: 'date', nullable: true })
  birth_date: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  cpf: string;

  @Column({ type: 'varchar', nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @ManyToMany(() => PersonSig, (personSig) => personSig.dependents, {
    cascade: true,
  })
  @JoinTable({
    name: 'person_sig_dependents',
    joinColumn: {
      name: 'dependent_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'person_sig_id',
      referencedColumnName: 'id',
    },
  })
  person_sigs: PersonSig[];

  @OneToMany(() => Patient, (patient) => patient.dependent)
  patients: Patient[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async toUpperCase() {
    this.name = this.name.toUpperCase();
  }
}
