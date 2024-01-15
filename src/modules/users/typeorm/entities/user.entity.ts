import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Exclude } from 'class-transformer';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 128,
  })
  password: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  salt: string;

  @OneToOne(() => PersonSig)
  person_sig: PersonSig;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
