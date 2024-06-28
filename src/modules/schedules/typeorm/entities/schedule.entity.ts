import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { ISchedule } from '@modules/schedules/interfaces/ISchedule';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique([
  'code',
  'professional',
  'specialty',
  'location',
  'available_date',
  'start_time',
  'end_time',
])
@Entity('schedules')
export class Schedule extends BaseEntity implements ISchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Generated('increment')
  @Column()
  code: number;

  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'varchar',
  })
  available_date: string;

  @Column({
    type: 'varchar',
  })
  start_time: string;

  @Column({
    type: 'varchar',
  })
  end_time: string;

  @Column({
    type: 'int',
    default: 0,
  })
  max_patients: number;

  @Column({
    type: 'int',
    default: 0,
  })
  patients_attended: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @ManyToOne(() => Professional, (professional) => professional.schedules)
  professional: Professional;

  @ManyToOne(() => Specialty, (specialty) => specialty.schedules)
  specialty: Specialty;

  @OneToMany(() => Appointment, (appointment) => appointment.schedule)
  appointments: Appointment[];

  @ManyToOne(() => Location, (location) => location.schedules)
  location: Location;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  async incrementPatientsAttended() {
    const schedule = await Schedule.findOne({
      where: { id: this.id },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.patients_attended += 1;
    await schedule.save();
  }

  async decrementPatientsAttended() {
    const schedule = await Schedule.findOne({
      where: { id: this.id },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (schedule.patients_attended > 0) {
      schedule.patients_attended -= 1;
      await schedule.save();
    }
  }
}
