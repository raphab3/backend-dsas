import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';

export enum CertificateType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export enum CertificateStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

@Entity('user_certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CertificateType,
    default: CertificateType.INTERNAL,
  })
  type: CertificateType;

  @Column({
    type: 'enum',
    enum: CertificateStatus,
    default: CertificateStatus.ACTIVE,
  })
  status: CertificateStatus;

  @Column({ type: 'text' })
  certificate: string;

  @Column({ type: 'text', nullable: true })
  private_key: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  external_provider: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ type: 'timestamptz' })
  valid_from: Date;

  @Column({ type: 'timestamptz' })
  valid_until: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
