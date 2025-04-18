import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';

@Entity('document_versions')
export class DocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  document_id: string;

  @ManyToOne(() => Document, (document) => document.versions)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column()
  version: number;

  @Column()
  mime_type: string;

  @Column()
  s3_location: string;

  @Column({ nullable: true })
  change_reason: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  is_signed_version: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column()
  created_by: string;

  @CreateDateColumn()
  created_at: Date;
}
