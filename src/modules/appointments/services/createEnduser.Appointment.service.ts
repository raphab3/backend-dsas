import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import PatientRepository from '@modules/patients/typeorm/repositories/PatientRepository';
import ScheduleRepository from '@modules/schedules/typeorm/repositories/ScheduleRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventsService } from '@shared/events/EventsService';
import { CreateEndUserAppointmentDto } from '../dto/create-enduser-Appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateEndUserAppointmentService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly appointmentRepository: AppointmentRepository,
    private readonly scheduleRepository: ScheduleRepository,
    @InjectRepository(PersonSig)
    private readonly personSigRepository: Repository<PersonSig>,
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(createAppointmentDto: CreateEndUserAppointmentDto) {
    const personSig = await this.personSigRepository.findOne({
      where: {
        id: createAppointmentDto.person_sig_id,
      },
      relations: ['dependents'],
    });

    if (!personSig) {
      throw new HttpException(`Servidor não encontrado`, HttpStatus.NOT_FOUND);
    }

    // Verifica a disponibilidade da agenda antes de processar o paciente
    const schedule = await this.validateSchedule(
      createAppointmentDto.schedule_id,
    );

    // Refatoração para criação/recuperação do paciente
    const patient = await this.findOrCreatePatient(
      personSig,
      createAppointmentDto.dependent_id,
    );

    // Criação do agendamento
    const savedAppointment = await this.createAppointment(
      schedule.id,
      patient.id,
    );

    return savedAppointment;
  }

  private async validateSchedule(scheduleId: string) {
    if (!scheduleId) {
      throw new HttpException('Agenda é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const schedule = await this.scheduleRepository.findOne(scheduleId);

    /* TODO: Validar se a data da agenda é maior que a data atual
       Deixar comentado enquando os cadastros dos meses anteriores não forem feitos
    */

    const currentDate = new Date();
    const scheduleDate = new Date(
      `${schedule.available_date}T${schedule.end_time}`,
    );

    if (!schedule || scheduleDate < currentDate) {
      throw new HttpException(
        'Agenda não encontrada ou passada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (schedule.max_patients <= schedule.patients_attended) {
      throw new HttpException('Agenda cheia', HttpStatus.CONFLICT);
    }

    return schedule;
  }

  private async findOrCreatePatient(personSig, dependentId?: string) {
    let patient;

    if (dependentId) {
      // Lógica para dependente
      const dependent = personSig.dependents.find(
        (dependent) => dependent.id === dependentId,
      );
      if (!dependent) {
        throw new HttpException(
          'Dependente não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      // Busca especificamente por dependent_id
      patient = await this.patientRepository.findByDependentId(dependentId);
      if (!patient) {
        patient = await this.patientRepository.create({
          person_sig_id: personSig.id,
          dependent_id: dependentId,
        });
      }
    } else {
      // Lógica para titular
      patient =
        await this.patientRepository.findPatientByPersonIdWithoutDependent(
          personSig.id,
        );

      if (!patient) {
        patient = await this.patientRepository.create({
          person_sig_id: personSig.id,
        });
      }
    }

    if (!patient) {
      throw new HttpException(
        'Falha ao criar ou encontrar paciente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return patient;
  }

  private async createAppointment(scheduleId: string, patientId: string) {
    const appointment = await this.appointmentRepository.create({
      schedule_id: scheduleId,
      patient_id: patientId,
    });

    this.eventsService.emit('statsUpdated');

    return appointment;
  }
}
