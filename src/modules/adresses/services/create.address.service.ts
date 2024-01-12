import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import IAddressRepository from '../typeorm/repositories/IAddressRepository';

@Injectable()
export class CreateAddressService {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(createAddressDto: CreateAddressDto) {
    return await this.addressRepository.create(createAddressDto);
  }
}
