import IAppointmentRepository from './IAppointmentRepository';
import { Appointment } from '../entities/Appointment.entity';
import { CreateAppointmentDto } from '@modules/Appointments/dto/create-Appointment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private ormRepository: Repository<Appointment>,
  ) {}

  public async create(data: CreateAppointmentDto): Promise<Appointment> {
    const Appointment = this.ormRepository.create(data);
    await this.ormRepository.save(Appointment);
    return Appointment;
  }

  public async list(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }

  public async findOne(id: string): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: CreateAppointmentDto,
  ): Promise<Appointment> {
    const builder = this.ormRepository.createQueryBuilder();
    const appointment = await builder
      .update(Appointment)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return appointment.raw[0];
  }
}

export default AppointmentRepository;
