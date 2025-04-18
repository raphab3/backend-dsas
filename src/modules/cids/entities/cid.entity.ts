import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cids')
@Index(['code', 'description'])
export class Cid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  code: string;

  @Column()
  @Index()
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  subcategory: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
