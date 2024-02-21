import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './typeorm/entities/Asset.entity';
import { AssetController } from './infra/controllers/Asset.controller';
import AssetRepository from './typeorm/repositories/AssetRepository';
import { CreateAssetService } from './services/create.Asset.service';
import { FindAllAssetService } from './services/findAll.Asset.service';
import { FindOneAssetService } from './services/findOne.Asset.service';
import { RemoveAssetService } from './services/remove.Asset.service';
import { UpdateAssetService } from './services/update.Asset.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Asset]);

@Module({
  controllers: [AssetController],
  providers: [
    AssetRepository,
    CreateAssetService,
    FindAllAssetService,
    FindOneAssetService,
    UpdateAssetService,
    RemoveAssetService,
  ],
  imports: [TYPE_ORM_TEMPLATES],
  exports: [AssetRepository],
})
export class AssetModule {}
