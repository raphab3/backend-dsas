import { Dependent } from '@modules/dependents/typeorm/entities/dependent.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('persons_sig')
export class PersonSig implements IPersonSig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  patente: string;

  @Column({ type: 'varchar', nullable: true })
  nome: string;

  @Column({ type: 'varchar', nullable: true })
  funcao: string;

  @Column({ type: 'varchar', nullable: true })
  identidade_militar: number;

  @Column({ type: 'varchar', nullable: true })
  data_nascimento: string | Date;

  @Column({ type: 'varchar', nullable: true })
  cod_unidade: number;

  @Column({ type: 'varchar', nullable: true })
  unidade: string;

  @Column({ type: 'varchar', nullable: true })
  imagem: string;

  @Column({ type: 'varchar', nullable: true })
  nome_guerra: string;

  @Column({ type: 'varchar', nullable: true })
  admissao: string | Date;

  @Column({ type: 'varchar', unique: true })
  matricula: string;

  @Column({ type: 'varchar', nullable: true })
  regime: string;

  @Column({ type: 'varchar', nullable: true })
  cpf: string;

  @Column({ type: 'varchar', nullable: true })
  sexo: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  pai: string;

  @Column({ type: 'varchar', nullable: true })
  mae: string;

  @Column({ type: 'varchar', nullable: true })
  naturalidade: string;

  @Column({ type: 'varchar', nullable: true })
  estado_civil: string;

  @Column({ type: 'varchar', nullable: true })
  ddd: string;

  @Column({ type: 'varchar', nullable: true })
  telefone: string;

  @Column({ type: 'varchar', nullable: true })
  endereco: string;

  @Column({ type: 'varchar', nullable: true })
  numero: string;

  @Column({ type: 'varchar', nullable: true })
  complemento: string;

  @Column({ type: 'varchar', nullable: true })
  bairro: string;

  @Column({ type: 'varchar', nullable: true })
  cidade: string;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'varchar', nullable: true })
  cep: number;

  @Column({ type: 'varchar', nullable: true })
  rg: number;

  @Column({ type: 'varchar', nullable: true })
  orgao_exp: string;

  @Column({ type: 'varchar', nullable: true })
  origem: string;

  // @Column({ type: 'enum', enum: Origin, default: Origin.PMPB, nullable: true })
  // origem: OriginType;

  @ManyToMany(() => Dependent, (dependent) => dependent.person_sigs)
  dependents: Dependent[];

  @OneToOne(() => User, (user) => user.person_sig, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Location, (location) => location.person_sigs, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'person_sig_locations',
    joinColumn: {
      name: 'person_sig_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'location_id',
      referencedColumnName: 'id',
    },
  })
  locations: Location[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.nome = this.nome.toUpperCase();
    this.nome_guerra = this.nome_guerra.toUpperCase();
    this.sexo = this.sexo.toUpperCase();
    this.email = this.email.toLowerCase();
  }
}
