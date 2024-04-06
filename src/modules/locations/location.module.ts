import LocationRepository from './typeorm/repositories/LocationRepository';
import { CreateLocationService } from './services/create.location.service';
import { FindAllCitieService } from './services/findAllCities.service';
import { FindAllLocationService } from './services/findAll.location.service';
import { FindOneLocationService } from './services/findOne.location.service';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { LocationController } from './infra/controllers/location.controller';
import { Module } from '@nestjs/common';
import { RemoveLocationService } from './services/remove.location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateLocationService } from './services/update.location.service';
import AuditModule from '@modules/audits/Audit.module';

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
    FindAllCitieService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [LocationRepository],
})
export class LocationModule {}
