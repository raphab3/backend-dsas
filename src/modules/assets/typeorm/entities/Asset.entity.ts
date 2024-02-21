import { IAsset } from '@modules/assets/interfaces/IAsset';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('assets')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  destination: string;

  @Column({ type: 'varchar', nullable: true })
  destination_responsible: string;

  @Column({ type: 'varchar', nullable: true })
  origin: string;

  @Column({ type: 'varchar', nullable: true })
  origin_responsible: string;

  @Column({ type: 'varchar', nullable: true })
  patrimony: string;

  @Column({ type: 'varchar', nullable: true })
  date_acquisition: Date;

  @Column({ type: 'varchar', nullable: true })
  responsible: string;

  @Column({ type: 'varchar', nullable: true })
  acquisition: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  observations: string;

  @Column({ type: 'varchar', nullable: true })
  movimentations: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
