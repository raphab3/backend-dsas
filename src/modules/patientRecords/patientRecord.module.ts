import { CreatePatientRecordService } from './services/create.patientRecord.service';
import { FindAllPatientRecordService } from './services/findAll.patientRecord.service';
import { FindOnePatientRecordService } from './services/findOne.patientRecord.service';
import { Module } from '@nestjs/common';
import { RemovePatientRecordService } from './services/remove.patientRecord.service';
import { PatientRecord } from './entities/patientRecord.entity';
import { PatientRecordController } from './controllers/patientRecord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePatientRecordService } from './services/update.patientRecord.service';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([PatientRecord]);

@Module({
  controllers: [PatientRecordController],
  providers: [
    FindOnePatientRecordService,
    CreatePatientRecordService,
    FindAllPatientRecordService,
    UpdatePatientRecordService,
    RemovePatientRecordService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class PatientRecordModule {}
