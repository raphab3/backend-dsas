import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { Certificate } from './certificate.entity';
import { Document } from '@modules/Documents/entities/document.entity';

export enum SignatureStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}

@Entity('document_signatures')
export class DocumentSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  document_id: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  certificate_id: string;

  @ManyToOne(() => Certificate)
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;

  @Column({ nullable: true })
  signature_requirement_id: string;

  @Column({ type: 'float', nullable: true })
  page: number;

  @Column({ type: 'float', nullable: true })
  position_x: number;

  @Column({ type: 'float', nullable: true })
  position_y: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  signature_data: string;

  @Column({
    type: 'enum',
    enum: SignatureStatus,
    default: SignatureStatus.VALID,
  })
  status: SignatureStatus;

  @Column({ nullable: true })
  s3_location: string;

  @CreateDateColumn()
  signed_at: Date;
}
