import PatientRepository from './typeorm/repositories/PatientRepository';
import { CreatePatientService } from './services/create.patient.service';
import { FindAllPatientService } from './services/findAll.patient.service';
import { FindOnePatientService } from './services/findOne.patient.service';
import { Module } from '@nestjs/common';
import { RemovePatientService } from './services/remove.patient.service';
import { Patient } from './typeorm/entities/patient.entity';
import { PatientController } from './infra/controllers/patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePatientService } from './services/update.patient.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Patient]);

@Module({
  controllers: [PatientController],
  providers: [
    PatientRepository,
    FindOnePatientService,
    CreatePatientService,
    FindAllPatientService,
    UpdatePatientService,
    RemovePatientService,
  ],
  imports: [TYPE_ORM_TEMPLATES],
})
export class PatientModule {}
