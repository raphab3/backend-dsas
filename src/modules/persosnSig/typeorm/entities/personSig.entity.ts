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
  })
  image: string;

  @Column({
    type: 'varchar',
  })
  is_military: boolean;

  @Column({
    type: 'varchar',
  })
  name_war: string;

  @Column({
    type: 'varchar',
  })
  admission: Date;

  @Column({
    type: 'varchar',
  })
  registration: string;

  @Column({
    type: 'varchar',
  })
  regime: string;

  @Column({
    type: 'varchar',
  })
  cpf: string;

  @Column({
    type: 'varchar',
  })
  driver_license: string;

  @Column({
    type: 'varchar',
  })
  address: string;

  @Column({
    type: 'varchar',
  })
  number: string;

  @Column({
    type: 'varchar',
  })
  complement: string;

  @Column({
    type: 'varchar',
  })
  neighborhood: string;

  @Column({
    type: 'varchar',
  })
  city: string;

  @Column({
    type: 'varchar',
  })
  state: string;

  @Column({
    type: 'varchar',
  })
  cep: string;

  @Column({
    type: 'varchar',
  })
  father: string;

  @Column({
    type: 'varchar',
  })
  mother: string;

  @Column({
    type: 'varchar',
  })
  nationality: string;

  @Column({
    type: 'varchar',
  })
  marital_status: string;

  @Column({
    type: 'varchar',
  })
  ddd: string;

  @Column({
    type: 'varchar',
  })
  phone: string;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  rg: string;

  @Column({
    type: 'varchar',
  })
  organ_exp: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
