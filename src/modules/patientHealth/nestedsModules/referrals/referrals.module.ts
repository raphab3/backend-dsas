import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { ReferralsController } from './controllers/referrals.controller';
import { CreateReferralService } from './services/create-referral.service';
import { PatientModule } from '@modules/patients/patient.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { AttendanceModule } from '@modules/attendances/attendance.module';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { LocationModule } from '@modules/locations/location.module';
import { UpdateReferralService } from './services/update-referral.service';
import { FindAllReferralsService } from './services/find-all-referrals.service';
import { FindOneReferralService } from './services/find-one-referral.service';
import { FindReferralsByPatientService } from './services/find-referrals-by-patient.service';
import { FindReferralsByAttendanceService } from './services/find-referrals-by-attendance.service';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Referral,
      Patient,
      Professional,
      Attendance,
      Specialty,
    ]),
    forwardRef(() => PatientModule),
    forwardRef(() => ProfessionalModule),
    forwardRef(() => AttendanceModule),
    forwardRef(() => SpecialtyModule),
    forwardRef(() => LocationModule),
  ],
  controllers: [ReferralsController],
  providers: [
    CreateReferralService,
    UpdateReferralService,
    FindAllReferralsService,
    FindOneReferralService,
    FindReferralsByPatientService,
    FindReferralsByAttendanceService,
  ],
  exports: [
    FindReferralsByPatientService,
    FindReferralsByAttendanceService,
    FindOneReferralService,
    CreateReferralService,
  ],
})
export class ReferralsModule {}
