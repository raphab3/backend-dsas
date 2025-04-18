import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { LocationCityEnum } from '@modules/locations/interfaces/ILocation';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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
    default: LocationCityEnum.JOAO_PESSOA,
  })
  city: LocationCityEnum;

  @Column({
    type: 'boolean',
    default: true,
  })
  schedule_enabled: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.location)
  schedules: Schedule[];

  @ManyToMany(() => PersonSig, (personSig) => personSig.locations)
  person_sigs: PersonSig[];

  @ManyToMany(() => Professional, (professional) => professional.locations)
  professionals: Professional[];

  @OneToMany(() => Attendance, (attendance) => attendance.location)
  attendances: Attendance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async toUpperCase() {
    this.name = this.name.toUpperCase();
  }
}
