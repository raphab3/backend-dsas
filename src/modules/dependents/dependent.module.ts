import DependentRepository from './typeorm/repositories/DependentRepository';
import { CreateDependentService } from './services/create.dependent.service';
import { Dependent } from './typeorm/entities/dependent.entity';
import { DependentController } from './infra/controllers/dependent.controller';
import { FindAllDependentService } from './services/findAll.dependent.service';
import { FindOneDependentService } from './services/findOne.dependent.service';
import { Module } from '@nestjs/common';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { RemoveDependentService } from './services/remove.dependent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateDependentService } from './services/update.dependent.service';
import { AuditModule } from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Dependent]);

@Module({
  controllers: [DependentController],
  providers: [
    DependentRepository,
    FindOneDependentService,
    CreateDependentService,
    FindAllDependentService,
    UpdateDependentService,
    RemoveDependentService,
  ],

  imports: [TYPE_ORM_TEMPLATES, PersonSigModule, AuditModule],
  exports: [DependentRepository],
})
export class DependentModule {}
