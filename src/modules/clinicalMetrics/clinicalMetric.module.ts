import { CreateClinicalMetricService } from './services/create.clinicalMetric.service';
import { FindAllClinicalMetricService } from './services/findAll.clinicalMetric.service';
import { FindOneClinicalMetricService } from './services/findOne.clinicalMetric.service';
import { Module } from '@nestjs/common';
import { RemoveClinicalMetricService } from './services/remove.clinicalMetric.service';
import { ClinicalMetric } from './entities/clinicalMetric.entity';
import { ClinicalMetricController } from './controllers/clinicalMetric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateClinicalMetricService } from './services/update.clinicalMetric.service';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([ClinicalMetric]);

@Module({
  controllers: [ClinicalMetricController],
  providers: [
    FindOneClinicalMetricService,
    CreateClinicalMetricService,
    FindAllClinicalMetricService,
    UpdateClinicalMetricService,
    RemoveClinicalMetricService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [CreateClinicalMetricService],
})
export class ClinicalMetricModule {}
