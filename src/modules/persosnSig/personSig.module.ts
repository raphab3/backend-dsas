import PersonSigRepository from './typeorm/repositories/PersonSigRepository';
import { CreatePersonSigService } from './services/create.personSig.service';
import { FindAllPersonSigService } from './services/findAll.personSig.service';
import { FindExternalSigpmpbService } from './services/findExternal.sigpmpb.service';
import { FindOnePersonSigService } from './services/findOne.personSig.service';
import { Module } from '@nestjs/common';
import { PersonSig } from './typeorm/entities/personSig.entity';
import { PersonSigController } from './infra/controllers/personSig.controller';
import { RemovePersonSigService } from './services/remove.personSig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePersonSigService } from './services/update.personSig.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([PersonSig]);

@Module({
  controllers: [PersonSigController],
  providers: [
    PersonSigRepository,
    FindOnePersonSigService,
    CreatePersonSigService,
    FindAllPersonSigService,
    UpdatePersonSigService,
    RemovePersonSigService,
    FindExternalSigpmpbService,
  ],
  imports: [TYPE_ORM_TEMPLATES],
})
export class PersonSigModule {}
