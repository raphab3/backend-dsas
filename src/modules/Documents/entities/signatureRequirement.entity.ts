import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Document } from './document.entity';

export enum SignatureRequirementStatus {
  SIGNED = 'SIGNED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('signature_requirements')
export class SignatureRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  document_id: string;

  @ManyToOne(() => Document, (document) => document.signatures)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  role: string;

  @Column()
  order: number;

  @Column({ type: 'float', nullable: true })
  position_x: number;

  @Column({ type: 'float', nullable: true })
  position_y: number;

  @Column({
    type: 'enum',
    enum: SignatureRequirementStatus,
    default: SignatureRequirementStatus.PENDING,
  })
  status: SignatureRequirementStatus;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
