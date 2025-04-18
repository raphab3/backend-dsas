import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAllergy } from './entities/allergy.entity';
import { ChronicCondition } from './entities/chronicCondition.entity';
import { AllergyService } from './services/allergy.service';
import { ChronicConditionService } from './services/chronic-condition.service';
import { PatientHealthInfoService } from './services/patient-health-info.service';
import { AllergyController } from './controllers/allergy.controller';
import { ChronicConditionController } from './controllers/chronic-condition.controller';
import { PatientHealthInfoController } from './controllers/patient-health-info.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientAllergy,
      ChronicCondition,
    ]),
  ],
  controllers: [
    AllergyController,
    ChronicConditionController,
    PatientHealthInfoController,
  ],
  providers: [
    AllergyService,
    ChronicConditionService,
    PatientHealthInfoService,
  ],
  exports: [
    AllergyService,
    ChronicConditionService,
    PatientHealthInfoService,
  ],
})
export class PatientHealthModule {}
