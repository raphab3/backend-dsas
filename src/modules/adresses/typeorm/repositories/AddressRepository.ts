import IAddressRepository from './IAddressRepository';
import { CreateAddressDto } from '@modules/adresses/dto/create-address.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

@Injectable()
class AddressRepository implements IAddressRepository {
  constructor(
    @InjectRepository(Address)
    private ormRepository: Repository<Address>,
  ) {}

  public async create(userData: CreateAddressDto): Promise<Address> {
    const address = this.ormRepository.create(userData);
    await this.ormRepository.save(address);
    return address;
  }
}

export default AddressRepository;
