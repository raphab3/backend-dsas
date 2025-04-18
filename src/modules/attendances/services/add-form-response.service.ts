import { FormResponseType } from '@modules/formResponses/interfaces';
import { CreateFormResponseService } from '@modules/formResponses/services/create.formResponse.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';
import { AddFormResponseDto } from '../dto/add-form-response.dto';
import { Attendance } from '../entities/attendance.entity';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AddFormResponseService {
  constructor(
    private dataSource: DataSource,
    @InjectConnection() private mongoConnection: Connection,
    private createFormResponseService: CreateFormResponseService,
  ) {}

  async execute(data: AddFormResponseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const mongoSession = await this.mongoConnection.startSession();
    mongoSession.startTransaction();

    try {
      const fullAttendance = await queryRunner.manager
        .createQueryBuilder(Attendance, 'attendance')
        .leftJoinAndSelect('attendance.professional', 'professional')
        .leftJoinAndSelect('attendance.patient', 'patient')
        .leftJoinAndSelect('attendance.appointment', 'appointment')
        .where('attendance.id = :id', { id: data.attendanceId })
        .getOne();

      if (!fullAttendance) {
        throw new NotFoundException('Attendance not found');
      }

      const formResponse = await this.createFormResponseService.execute({
        templateId: data.formTemplateId,
        createdBy: fullAttendance.professional.id,
        type: FormResponseType.ATTENDANCE,
        metadata: {
          patientId: fullAttendance.patient.id,
          professionalId: fullAttendance.professional.id,
          formTemplateId: data.formTemplateId,
          appointmentId: fullAttendance.appointment?.id,
          isScheduled: !!fullAttendance.appointment,
        },
      });

      fullAttendance.formResponseIds = [
        ...(fullAttendance.formResponseIds || []),
        formResponse._id.toString(),
      ];

      const updatedAttendance = await queryRunner.manager.save(
        Attendance,
        fullAttendance,
      );

      await queryRunner.commitTransaction();
      await mongoSession.commitTransaction();

      return {
        attendance: updatedAttendance,
        formResponse,
      };
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
