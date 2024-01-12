import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('persons_sigs')
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
