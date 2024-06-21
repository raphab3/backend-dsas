import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  userId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  action: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  method: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  url: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  details: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  userIp: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  audit_log: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  requestBody: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  responsePayload: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  responseStatus: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
