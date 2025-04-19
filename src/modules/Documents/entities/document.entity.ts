import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { DocumentVersion } from './documentVersion.entity';
import { SignatureRequirement } from './signatureRequirement.entity';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  ARCHIVED = 'ARCHIVED',
}

export enum DocumentType {
  CREATED = 'CREATED',
  UPLOADED = 'UPLOADED',
  FORM_BASED = 'FORM_BASED',
  COMBINED = 'COMBINED',
}

export enum DocumentCategory {
  MEDICAL = 'MEDICAL',
  REPORT = 'REPORT',
  PRESCRIPTION = 'PRESCRIPTION',
  CERTIFICATE = 'CERTIFICATE',
  CONSENT_FORM = 'CONSENT_FORM',
  OTHER = 'OTHER',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.FORM_BASED,
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentCategory,
    default: DocumentCategory.OTHER,
  })
  category: DocumentCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  next_action: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  form_template_id: string;

  @ManyToOne(() => FormTemplate, { nullable: true })
  @JoinColumn({ name: 'form_template_id' })
  form_template: FormTemplate;

  @Column({ nullable: true })
  form_response_id: string;

  @Column({ type: 'json', nullable: true })
  parent_document_ids: string[];

  @Column({ nullable: true })
  header_template_id: string;

  @Column({ nullable: true })
  footer_template_id: string;

  @Column({ default: false })
  is_signature_required: boolean;

  @Column({ nullable: true })
  @Index()
  verification_code: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column()
  created_by: string;

  @OneToMany(() => DocumentVersion, (version) => version.document)
  versions: DocumentVersion[];

  @OneToMany(() => SignatureRequirement, (signature) => signature.document)
  signatures: SignatureRequirement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
