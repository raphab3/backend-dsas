import SpecialtyRepository from './typeorm/repositories/SpecialtyRepository';
import { CreateSpecialtieservice } from './services/create.Specialty.service';
import { FindAllSpecialtieservice } from './services/findAll.Specialty.service';
import { FindOneSpecialtieservice } from './services/findOne.Specialty.service';
import { Module } from '@nestjs/common';
import { RemoveSpecialtieservice } from './services/remove.Specialty.service';
import { Specialty } from './typeorm/entities/Specialty.entity';
import { SpecialtyController } from './infra/controllers/Specialty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateSpecialtieservice } from './services/update.Specialty.service';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Specialty]);

@Module({
  controllers: [SpecialtyController],
  providers: [
    SpecialtyRepository,
    FindOneSpecialtieservice,
    CreateSpecialtieservice,
    FindAllSpecialtieservice,
    UpdateSpecialtieservice,
    RemoveSpecialtieservice,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [SpecialtyRepository],
})
export class SpecialtyModule {}
