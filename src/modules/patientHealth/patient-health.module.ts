import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAllergy } from './entities/allergy.entity';
import { ChronicCondition } from './entities/chronicCondition.entity';
import { PatientMedication } from './entities/medication.entity';
import { AllergyService } from './services/allergy.service';
import { ChronicConditionService } from './services/chronic-condition.service';
import { PatientHealthInfoService } from './services/patient-health-info.service';
import { MedicationService } from './services/medication.service';
import { AllergyController } from './controllers/allergy.controller';
import { ChronicConditionController } from './controllers/chronic-condition.controller';
import { PatientHealthInfoController } from './controllers/patient-health-info.controller';
import { MedicationController } from './controllers/medication.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientAllergy,
      ChronicCondition,
      PatientMedication,
    ]),
  ],
  controllers: [
    AllergyController,
    ChronicConditionController,
    PatientHealthInfoController,
    MedicationController,
  ],
  providers: [
    AllergyService,
    ChronicConditionService,
    PatientHealthInfoService,
    MedicationService,
  ],
  exports: [
    AllergyService,
    ChronicConditionService,
    PatientHealthInfoService,
    MedicationService,
  ],
})
export class PatientHealthModule {}
