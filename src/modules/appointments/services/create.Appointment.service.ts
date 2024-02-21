import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import PatientRepository from '@modules/patients/typeorm/repositories/PatientRepository';
import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';
import ScheduleRepository from '@modules/schedules/typeorm/repositories/ScheduleRepository';
import { CreateAppointmentDto } from '../dto/create-Appointment.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CreateAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly personSigRepository: PersonSigRepository,
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(createAppointmentDto: CreateAppointmentDto) {
    const personSig = await this.personSigRepository.findByMatricula(
      createAppointmentDto.matricula,
    );

    console.log('[22]: personSig', personSig);

    let patient: any = null;

    if (!personSig) {
      throw new HttpException(
        `Servidor com matrícula ${createAppointmentDto.matricula} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isDependent = createAppointmentDto.dependent_id ? true : false;

    console.log('[34]: isDependent', isDependent);

    if (isDependent) {
      const dependent = personSig.dependents.find(
        (dependent) => dependent.id === createAppointmentDto.dependent_id,
      );

      if (!dependent) {
        throw new HttpException(
          'Dependente não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const hasPatient = await this.patientRepository.findByDependentId(
        createAppointmentDto.dependent_id,
      );

      console.log('[52]: hasPatient', hasPatient);

      if (!hasPatient) {
        console.log('[55]: hasPatient', hasPatient);

        console.log('[57]: personSig', personSig.id);
        console.log('[58]: dependent', dependent.id);
        patient = await this.patientRepository.create({
          person_sig_id: personSig.id,
          dependent_id: dependent.id,
        });
      } else {
        patient = hasPatient;
        console.log('[62]: patient', patient);
      }
    } else {
      const hasPatient = await this.patientRepository.findByMatricula(
        personSig.matricula,
      );

      if (!hasPatient) {
        patient = await this.patientRepository.create({
          person_sig_id: personSig.id,
        });
      } else {
        patient = hasPatient;
      }
    }

    const schedule = await this.scheduleRepository.findOne(
      createAppointmentDto.schedule_id,
    );

    const date = new Date(schedule.available_date);
    const time = new Date(schedule.start_time);

    if (
      date < new Date() ||
      (date.getDate() === new Date().getDate() && time < new Date())
    ) {
      throw new HttpException('Agenda passada', HttpStatus.CONFLICT);
    }

    if (schedule.max_patients <= schedule.patients_attended) {
      throw new HttpException('Agenda cheia', HttpStatus.CONFLICT);
    }

    // const appointment =
    //   await this.appointmentRepository.existsAppointmentForPatientSchedule(
    //     patient.id,
    //     createAppointmentDto.schedule_id,
    //   );

    // if (appointment) {
    //   throw new HttpException(
    //     'Paciente já agendado para essa agenda',
    //     HttpStatus.CONFLICT,
    //   );
    // }

    if (!patient.id) {
      throw new HttpException('Paciente não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!createAppointmentDto.schedule_id) {
      throw new HttpException('Agenda é obrigatório', HttpStatus.BAD_REQUEST);
    }

    if (!schedule) {
      throw new HttpException('Agenda não encontrada', HttpStatus.NOT_FOUND);
    }

    const saved = await this.appointmentRepository.create({
      schedule_id: schedule.id,
      patient_id: patient.id,
    });

    await this.scheduleRepository.update(schedule.id, {
      ...schedule,
      patients_attended: schedule.patients_attended + 1,
    });

    return saved;
  }
}
