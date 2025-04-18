import 'reflect-metadata';
import IAttachment, {
  AttachmentsEnuns,
  AttachmentsType,
  DriversEnuns,
  StorageDriverType,
} from '@modules/attachments/interfaces/IAttachment';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attachments')
export default class Attachment implements IAttachment {
  @PrimaryGeneratedColumn()
  id: string;

  @Index()
  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  filename: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fieldname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  mimetype: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  size: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  originalname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  path: string;

  @Column({
    type: 'enum',
    enum: [...DriversEnuns],
  })
  storage_drive: StorageDriverType;

  @Column({
    type: 'enum',
    enum: [...AttachmentsEnuns],
  })
  attachment_type: AttachmentsType;

  file_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
