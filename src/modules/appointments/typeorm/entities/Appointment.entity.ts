import {
  IAppointment,
  StatusAppointmentEnum,
} from '@modules/appointments/interfaces/IAppointment';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  AfterInsert,
  BaseEntity,
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['schedule', 'patient'])
@Entity('appointments')
export class Appointment extends BaseEntity implements IAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments)
  schedule: Schedule;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @Column({
    type: 'enum',
    enum: StatusAppointmentEnum,
    default: 'scheduled',
  })
  status: StatusAppointmentEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterInsert()
  async handleInsert() {
    await this.schedule.incrementPatientsAttended();
  }

  @BeforeRemove()
  async handleRemove() {
    const appointment = await Appointment.findOne({
      where: { id: this.id },
      relations: ['schedule'],
    });

    if (!appointment) {
      throw new Error('Appointment not found.');
    }

    await appointment.schedule.decrementPatientsAttended();
  }
}
