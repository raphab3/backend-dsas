import { CreateAddressService } from '../../services/create.address.service';
import { FindAllAddressService } from '../../services/findAll.address.service';
import { FindOneAddressService } from '../../services/findOne.address.service';
import { RemoveAddressService } from '../../services/remove.address.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAddressService } from '../../services/update.address.service';
import { AddressController } from './address.controller';

describe('AddressController', () => {
  let controller: AddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        CreateAddressService,
        FindAllAddressService,
        FindOneAddressService,
        UpdateAddressService,
        RemoveAddressService,
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
