import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@guards/rule.enum';
import { IUser } from '@modules/users/interfaces/user.interface';
import { Exclude } from 'class-transformer';

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

  @Column('enum', { enum: Role, array: true, default: [Role.User] })
  rules: Role[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
