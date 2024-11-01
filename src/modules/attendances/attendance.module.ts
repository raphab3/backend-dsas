import { CreateAttendanceService } from './services/create.attendance.service';
import { FindAllAttendanceService } from './services/findAll.attendance.service';
import { FindOneAttendanceService } from './services/findOne.attendance.service';
import { Module } from '@nestjs/common';
import { RemoveAttendanceService } from './services/remove.attendance.service';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuditModule from '@modules/audits/Audit.module';
import { AttendanceController } from './controllers/attendance.controller';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Attendance]);

@Module({
  controllers: [AttendanceController],
  providers: [
    FindOneAttendanceService,
    CreateAttendanceService,
    FindAllAttendanceService,
    RemoveAttendanceService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class AttendanceModule {}
