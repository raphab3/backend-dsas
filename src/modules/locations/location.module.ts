import LocationRepository from './typeorm/repositories/LocationRepository';
import { AuditModule } from '@modules/audits/Audit.module';
import { CreateLocationService } from './services/create.location.service';
import { FindAllLocationService } from './services/findAll.location.service';
import { FindOneLocationService } from './services/findOne.location.service';
import { Module } from '@nestjs/common';
import { RemoveLocationService } from './services/remove.location.service';
import { Location } from './typeorm/entities/location.entity';
import { LocationController } from './infra/controllers/location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateLocationService } from './services/update.location.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Location]);

@Module({
  controllers: [LocationController],
  providers: [
    LocationRepository,
    FindOneLocationService,
    CreateLocationService,
    FindAllLocationService,
    UpdateLocationService,
    RemoveLocationService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class LocationModule {}
