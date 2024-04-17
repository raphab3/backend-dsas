import {
  IAppointment,
  StatusAppointmentEnum,
} from '@modules/appointments/interfaces/IAppointment';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
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

  private previousStatus: StatusAppointmentEnum;

  @BeforeInsert()
  async handleInsert() {
    console.log('BeforeInsert: schedule id', this.schedule.id);

    // Carregue a entidade Schedule se necessário ou se não estiver já carregada
    if (!this.schedule) {
      this.schedule = await Schedule.findOne({
        where: { id: this.schedule.id },
      });

      console.log('BeforeInsert: schedule', this.schedule);

      if (!this.schedule) {
        throw new Error('Schedule not found.');
      }
    }

    await this.schedule.incrementPatientsAttended();
  }

  @BeforeUpdate()
  async handleUpdate() {
    const oldAppointment = await Appointment.findOne({
      where: { id: this.id },
      relations: ['schedule'],
    });
    if (oldAppointment) {
      this.previousStatus = oldAppointment.status;
    }

    if (
      (this.previousStatus === StatusAppointmentEnum.SCHEDULED ||
        this.previousStatus === StatusAppointmentEnum.ATTENDED) &&
      (this.status === StatusAppointmentEnum.CANCELED ||
        this.status === StatusAppointmentEnum.MISSED)
    ) {
      await oldAppointment.schedule.decrementPatientsAttended();
    } else if (
      (this.previousStatus === StatusAppointmentEnum.CANCELED ||
        this.previousStatus === StatusAppointmentEnum.MISSED) &&
      (this.status === StatusAppointmentEnum.SCHEDULED ||
        this.status === StatusAppointmentEnum.ATTENDED)
    ) {
      await oldAppointment.schedule.incrementPatientsAttended();
    }
  }

  @BeforeRemove()
  async handleRemove() {
    // Carrega a entidade Appointment com a relação schedule carregada
    const appointment = await Appointment.findOne({
      where: { id: this.id },
      relations: ['schedule'],
    });

    console.log(appointment);

    if (!appointment) {
      throw new Error('Appointment not found.');
    }

    await appointment.schedule.decrementPatientsAttended();
  }
}
