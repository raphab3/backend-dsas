import { CreateTraineeService } from './services/create.trainee.service';
import { FindAllTraineeService } from './services/findAll.trainee.service';
import { FindOneTraineeService } from './services/findOne.trainee.service';
import { Module } from '@nestjs/common';
import { RemoveTraineeService } from './services/remove.trainee.service';
import { Trainee } from './entities/trainee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateTraineeService } from './services/update.trainee.service';
import AuditModule from '@modules/audits/Audit.module';
import { TraineeController } from './controllers/trainee.controller';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Trainee, Professional]);

@Module({
  controllers: [TraineeController],
  providers: [
    FindOneTraineeService,
    CreateTraineeService,
    FindAllTraineeService,
    UpdateTraineeService,
    RemoveTraineeService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class TraineeModule {}
