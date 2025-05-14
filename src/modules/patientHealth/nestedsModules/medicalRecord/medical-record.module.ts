import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalRecordController } from './controllers/medical-record.controller';
import { MedicalRecordService } from './services/medical-record.service';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { AttendanceModule } from '@modules/attendances/attendance.module';
import { PatientHealthModule } from '@modules/patientHealth/patient-health.module';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Attendance,
      Patient,
      Professional,
    ]),
    forwardRef(() => AttendanceModule),
    PatientHealthModule,
    ExamsModule,
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
