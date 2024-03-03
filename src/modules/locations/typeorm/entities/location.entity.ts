import { LocationCityEnum } from '@modules/locations/interfaces/ILocation';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
@Unique(['name', 'city'])
@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: LocationCityEnum,
  })
  city: LocationCityEnum;

  @OneToMany(() => Schedule, (schedule) => schedule.location)
  schedules: Schedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
