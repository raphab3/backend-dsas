import AddressRepository from './typeorm/repositories/AddressRepository';
import { Address } from './typeorm/entities/address.entity';
import { AddressController } from './infra/controllers/address.controller';
import { CreateAddressService } from './services/create.address.service';
import { FindAllAddressService } from './services/findAll.address.service';
import { FindOneAddressService } from './services/findOne.address.service';
import { Module } from '@nestjs/common';
import { RemoveAddressService } from './services/remove.address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateAddressService } from './services/update.address.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Address]);

@Module({
  controllers: [AddressController],
  providers: [
    AddressRepository,
    FindOneAddressService,
    CreateAddressService,
    FindAllAddressService,
    UpdateAddressService,
    RemoveAddressService,
  ],
  imports: [TYPE_ORM_TEMPLATES],
})
export class AddressModule {}
