import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamType } from './entities/exam-type.entity';
import { ExamAttachment } from './entities/exam-attachment.entity';
import { ExamTypesController } from './controllers/exam-types.controller';
import { ExamsController } from './controllers/exams.controller';
import { ExamAttachmentsController } from './controllers/exam-attachments.controller';
import { CreateExamTypeService } from './services/create-exam-type.service';
import { UpdateExamTypeService } from './services/update-exam-type.service';
import { FindAllExamTypesService } from './services/find-all-exam-types.service';
import { FindOneExamTypeService } from './services/find-one-exam-type.service';
import { CreateExamService } from './services/create-exam.service';
import { UpdateExamService } from './services/update-exam.service';
import { FindAllExamsService } from './services/find-all-exams.service';
import { FindOneExamService } from './services/find-one-exam.service';
import { FindExamsByPatientService } from './services/find-exams-by-patient.service';
import { FindExamsByAttendanceService } from './services/find-exams-by-attendance.service';
import { ExamAttachmentService } from './services/exam-attachment.service';
import { PatientModule } from '@modules/patients/patient.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { AttendanceModule } from '@modules/attendances/attendance.module';
import { ProvidersModule } from '@shared/providers/providers.module';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exam,
      ExamType,
      ExamAttachment,
      Patient,
      Professional,
      Attendance,
    ]),
    forwardRef(() => PatientModule),
    forwardRef(() => ProfessionalModule),
    forwardRef(() => AttendanceModule),
    ProvidersModule,
  ],
  controllers: [
    ExamTypesController,
    ExamsController,
    ExamAttachmentsController,
  ],
  providers: [
    CreateExamTypeService,
    UpdateExamTypeService,
    FindAllExamTypesService,
    FindOneExamTypeService,
    CreateExamService,
    UpdateExamService,
    FindAllExamsService,
    FindOneExamService,
    FindExamsByPatientService,
    FindExamsByAttendanceService,
    ExamAttachmentService,
  ],
  exports: [
    FindExamsByPatientService,
    FindExamsByAttendanceService,
    FindOneExamService,
    CreateExamService,
    ExamAttachmentService,
  ],
})
export class ExamsModule {}
