import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';
import { Document } from '@modules/Documents/entities/document.entity';

@Injectable()
export class DeleteFormResponseService {
  constructor(
    private dataSource: DataSource,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async execute(attendanceId: string, formResponseId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar o atendimento com lock
      const attendance = await queryRunner.manager
        .createQueryBuilder(Attendance, 'attendance')
        .setLock('pessimistic_write')
        .where('attendance.id = :id', { id: attendanceId })
        .getOne();

      if (!attendance) {
        throw new NotFoundException('Attendance not found');
      }

      // Verificar se o formResponseId existe no attendance
      if (!attendance.formResponseIds?.includes(formResponseId)) {
        throw new NotFoundException(
          'FormResponse not found in this attendance',
        );
      }

      // Buscar e deletar o HealthcareDocument relacionado
      const healthcareDocument = await this.documentRepository.findOne({
        where: {
          form_response_id: formResponseId,
          // attendance: { id: attendanceId },
        },
      });

      if (healthcareDocument) {
        await queryRunner.manager.remove(Document, healthcareDocument);
      }

      // Deletar o documento no MongoDB (sem transação)
      const deleteResult = await this.formResponseModel.deleteOne({
        _id: formResponseId,
      });

      if (deleteResult.deletedCount === 0) {
        throw new NotFoundException('FormResponse not found in MongoDB');
      }

      // Atualizar o attendance removendo o formResponseId
      attendance.formResponseIds = attendance.formResponseIds.filter(
        (id) => id !== formResponseId,
      );

      // Salvar as alterações no attendance
      const updatedAttendance = await queryRunner.manager.save(
        Attendance,
        attendance,
      );

      // Commit da transação do PostgreSQL
      await queryRunner.commitTransaction();

      return {
        message: 'FormResponse and related documents deleted successfully',
        attendance: updatedAttendance,
      };
    } catch (error) {
      // Rollback apenas da transação do PostgreSQL
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
