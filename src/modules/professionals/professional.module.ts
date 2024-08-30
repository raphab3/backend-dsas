import AuditModule from '@modules/audits/Audit.module';
import ProfessionalRepository from './typeorm/repositories/ProfessionalRepository';
import { CreateProfessionalService } from './services/create.professional.service';
import { FindAllProfessionalService } from './services/findAll.professional.service';
import { FindOneProfessionalService } from './services/findOne.professional.service';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { Module } from '@nestjs/common';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { Professional } from './typeorm/entities/professional.entity';
import { ProfessionalController } from './infra/controllers/professional.controller';
import { RemoveProfessionalService } from './services/remove.professional.service';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateProfessionalService } from './services/update.professional.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  Professional,
  Specialty,
  Location,
]);

@Module({
  controllers: [ProfessionalController],
  providers: [
    ProfessionalRepository,
    FindOneProfessionalService,
    CreateProfessionalService,
    FindAllProfessionalService,
    UpdateProfessionalService,
    RemoveProfessionalService,
  ],
  imports: [TYPE_ORM_TEMPLATES, PersonSigModule, AuditModule],
  exports: [ProfessionalRepository],
})
export class ProfessionalModule {}
