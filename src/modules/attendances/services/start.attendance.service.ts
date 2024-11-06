import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { CreateFormResponseService } from '@modules/formResponses/services/create.formResponse.service';
import { AttendanceStatusEnum } from '../types';
import { StartAttendanceDto } from '../dto/start-attendance.dto';
import { FormResponseType } from '@modules/formResponses/interfaces';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection as MongoConnection } from 'mongoose';
import { StatusAppointmentEnum } from '@modules/appointments/interfaces/IAppointment';

@Injectable()
export class StartAttendanceService {
  constructor(
    private dataSource: DataSource,
    @InjectConnection() private mongoConnection: MongoConnection,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(GroupFormTemplate)
    private groupFormTemplateRepository: Repository<GroupFormTemplate>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private createFormResponseService: CreateFormResponseService,
  ) {}

  async execute(startAttendanceDto: StartAttendanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const mongoSession = await this.mongoConnection.startSession();
    mongoSession.startTransaction();

    try {
      // 1. Validate if patient exists
      const patient = await queryRunner.manager.findOne(Patient, {
        where: { id: startAttendanceDto.patientId },
      });
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      // 2. Validate if professional exists
      const professional = await queryRunner.manager.findOne(Professional, {
        where: { id: startAttendanceDto.professionalId },
      });
      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      // 3. Get group form template with its templates
      const groupFormTemplate = await queryRunner.manager.findOne(
        GroupFormTemplate,
        {
          where: { id: startAttendanceDto.groupFormTemplateId },
          relations: ['templates'],
        },
      );
      if (!groupFormTemplate) {
        throw new NotFoundException('Group Form Template not found');
      }

      // 4. Get and update appointment if provided
      let appointment = null;
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
          relations: ['patient', 'schedule', 'schedule.professional'],
        });

        // Validate if appointment belongs to the patient and professional
        if (
          appointment.patient.id !== patient.id ||
          appointment.schedule.professional.id !== professional.id
        ) {
          throw new NotFoundException(
            'Appointment does not match patient and professional',
          );
        }

        // Update appointment status
        appointment.status = StatusAppointmentEnum.IN_ATTENDANCE;
        await queryRunner.manager.save(Appointment, appointment);
      }

      // 5. Create form responses for each template in the group using mongoTemplateId
      const formResponsePromises = groupFormTemplate.templates.map((template) =>
        this.createFormResponseService.execute({
          templateId: template.mongoTemplateId,
          createdBy: professional.id,
          type: FormResponseType.ATTENDANCE,
          metadata: {
            patientId: patient.id,
            professionalId: professional.id,
            formTemplateId: template.id,
            category: template.category,
            appointmentId: appointment?.id,
            isScheduled: !!appointment,
          },
        }),
      );

      const formResponses = await Promise.all(formResponsePromises);
      const formResponseIds = formResponses.map((response) =>
        response._id.toString(),
      );

      // 6. Create attendance
      const attendance = queryRunner.manager.create(Attendance, {
        patient,
        professional,
        groupFormTemplate,
        formResponseIds,
        startAttendance: new Date(),
        status: AttendanceStatusEnum.IN_PROGRESS,
        endAttendance: null,
        appointment,
      });

      const savedAttendance = await queryRunner.manager.save(
        Attendance,
        attendance,
      );

      await queryRunner.commitTransaction();
      await mongoSession.commitTransaction();

      return savedAttendance;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      await mongoSession.endSession();
    }
  }
}
