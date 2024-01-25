import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('persons_sig')
export class PersonSig implements IPersonSig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  patent: string;

  @Column({
    type: 'varchar',
  })
  post: string;

  @Column({
    type: 'varchar',
  })
  military_identity: string;

  @Column({
    type: 'varchar',
  })
  date_birth: Date;

  @Column({
    type: 'varchar',
  })
  cod_unit: string;

  @Column({
    type: 'varchar',
  })
  situation: string;

  @Column({
    type: 'varchar',
  })
  unit: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  image: string;

  @Column({
    type: 'varchar',
  })
  is_military: boolean;

  @Column({
    type: 'varchar',
    default: null,
  })
  name_war: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  admission: Date;

  @Column({
    type: 'varchar',
    default: null,
  })
  registration: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  regime: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  cpf: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  driver_license: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  address: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  number: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  complement: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  neighborhood: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  city: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  state: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  cep: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  father: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  mother: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  nationality: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  marital_status: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  ddd: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  phone: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  email: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  rg: string;

  @Column({
    type: 'varchar',
    default: null,
  })
  organ_exp: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
