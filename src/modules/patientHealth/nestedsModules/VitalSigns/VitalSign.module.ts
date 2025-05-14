import { FindAllVitalSignsService } from './services/findAll.VitalSigns.service';
import { Module } from '@nestjs/common';
import { VitalSigns } from './entities/VitalSigns.entity';
import { VitalSignsController } from './controllers/VitalSigns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuditModule from '@modules/audits/Audit.module';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { RemoveVitalSignsService } from './services/remove.VitalSign.service';
import { UpsertVitalSignsService } from './services/upsert.VitalSign.service';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { GetVitalSignsHistoryService } from './services/getHistory.VitalSigns.service';
import { GetLatestVitalSignsService } from './services/getLatest.VitalSigns.service';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  VitalSigns,
  Professional,
  Attendance,
  Patient,
]);

@Module({
  controllers: [VitalSignsController],
  providers: [
    FindAllVitalSignsService,
    UpsertVitalSignsService,
    RemoveVitalSignsService,
    GetVitalSignsHistoryService,
    GetLatestVitalSignsService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [GetVitalSignsHistoryService, GetLatestVitalSignsService],
})
export class VitalSignsModule {}
