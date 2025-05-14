import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { AttendanceStatusEnum } from '../types';
import { StartAttendanceDto } from '../dto/start-attendance.dto';
import { StatusAppointmentEnum } from '@modules/appointments/interfaces/IAppointment';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class StartAttendanceService {
  constructor(private dataSource: DataSource) {}

  async execute(startAttendanceDto: StartAttendanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validate if patient exists
      const patient = await queryRunner.manager.findOne(Patient, {
        where: { id: startAttendanceDto.patientId },
      });
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      // 1.1 Check if patient has a previous attendance that needs follow-up
      const previousAttendance = await queryRunner.manager.findOne(Attendance, {
        where: {
          patient: { id: startAttendanceDto.patientId },
          needsFollowUp: true,
          status: AttendanceStatusEnum.COMPLETED,
        },
        order: { endAttendance: 'DESC' },
      });

      // 1.2 Check if patient has a previous attendance with this professional
      const previousAttendanceWithProfessional =
        await queryRunner.manager.findOne(Attendance, {
          where: {
            patient: { id: startAttendanceDto.patientId },
            professional: { id: startAttendanceDto.professionalId },
            status: AttendanceStatusEnum.COMPLETED,
          },
          order: { endAttendance: 'DESC' },
        });

      // 2. Validate if professional exists
      const professional = await queryRunner.manager.findOne(Professional, {
        where: { id: startAttendanceDto.professionalId },
      });
      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      // 4. Get and update appointment if provided
      let appointment = null;
      let specialty = null;
      let location = null;

      if (startAttendanceDto.appointmentId) {
        // Primeiro buscar o appointment com lock
        appointment = await queryRunner.manager
          .createQueryBuilder(Appointment, 'appointment')
          .setLock('pessimistic_write')
          .where('appointment.id = :id', {
            id: startAttendanceDto.appointmentId,
          })
          .getOne();

        if (!appointment) {
          throw new NotFoundException('Appointment not found');
        }

        // Depois buscar as relações
        appointment = await queryRunner.manager.findOne(Appointment, {
          where: { id: appointment.id },
          relations: [
            'patient',
            'schedule',
            'schedule.professional',
            'schedule.specialty',
          ],
        });

        // Validate if appointment belongs to the patient and professional
        // if (
        //   appointment.patient.id !== patient.id ||
        //   appointment.schedule.professional.id !== professional.id
        // ) {
        //   throw new NotFoundException(
        //     'Esse agendamento não foi destinado profissional informado',
        //   );
        // }

        // Get specialty and location from appointment
        if (appointment.schedule?.specialty) {
          specialty = appointment.schedule.specialty;
        }

        if (appointment.schedule?.location) {
          location = appointment.schedule.location;
        }

        // Update appointment status
        appointment.status = StatusAppointmentEnum.IN_ATTENDANCE;
        await queryRunner.manager.save(Appointment, appointment);
      } else if (startAttendanceDto.specialtyId) {
        // If no appointment but specialtyId is provided, get the specialty
        specialty = await queryRunner.manager.findOne(Specialty, {
          where: { id: startAttendanceDto.specialtyId },
        });

        if (!specialty) {
          throw new NotFoundException('Specialty not found');
        }

        // If locationId is provided, get the location
        if (startAttendanceDto.locationId) {
          location = await queryRunner.manager.findOne(Location, {
            where: {
              id: startAttendanceDto.locationId,
            } as FindOptionsWhere<Location>,
          });

          if (!location) {
            throw new NotFoundException('Location not found');
          }
        }
      } else {
        // For standalone attendances without appointment, specialtyId is required
        throw new BadRequestException(
          'Either appointmentId or specialtyId must be provided',
        );
      }

      // 6. Create attendance
      const attendance = queryRunner.manager.create(Attendance, {
        patient,
        professional,
        startAttendance: new Date(),
        status: AttendanceStatusEnum.IN_PROGRESS,
        endAttendance: null,
        appointment,
        specialty,
        location,
        isFollowUp:
          startAttendanceDto.isFollowUp || (previousAttendance ? true : false),
        isFirstAttendance:
          startAttendanceDto.isFirstAttendance !== undefined
            ? startAttendanceDto.isFirstAttendance
            : !previousAttendanceWithProfessional, // É o primeiro atendimento com este profissional
      });

      // If this is a follow-up from a previous attendance that needed follow-up,
      // update the previous attendance to mark it as followed up
      if (previousAttendance && !startAttendanceDto.isFollowUp) {
        previousAttendance.needsFollowUp = false;
        await queryRunner.manager.save(Attendance, previousAttendance);
      }

      const savedAttendance = await queryRunner.manager.save(
        Attendance,
        attendance,
      );

      await queryRunner.commitTransaction();

      return savedAttendance;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
