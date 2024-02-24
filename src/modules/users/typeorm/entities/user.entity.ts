import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { IUser } from '@modules/users/interfaces/IUser';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';

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

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  roles: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  individual_permissions: Permission[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
