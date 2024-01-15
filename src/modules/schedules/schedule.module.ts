import ScheduleRepository from './typeorm/repositories/ScheduleRepository';
import { CreateScheduleService } from './services/create.schedule.service';
import { FindAllScheduleService } from './services/findAll.schedule.service';
import { FindOneScheduleService } from './services/findOne.schedule.service';
import { Module } from '@nestjs/common';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { RemoveScheduleService } from './services/remove.schedule.service';
import { Schedule } from './typeorm/entities/schedule.entity';
import { ScheduleController } from './infra/controllers/schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateScheduleService } from './services/update.schedule.service';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Schedule]);

@Module({
  controllers: [ScheduleController],
  providers: [
    ScheduleRepository,
    FindOneScheduleService,
    CreateScheduleService,
    FindAllScheduleService,
    UpdateScheduleService,
    RemoveScheduleService,
  ],
  imports: [TYPE_ORM_TEMPLATES, ProfessionalModule, SpecialtyModule],
})
export class ScheduleModule {}
