import { CreateAddressDto } from '@modules/adresses/dto/create-address.dto';
import { Address } from '../entities/address.entity';

export default interface IAddressRepository {
  create(data: CreateAddressDto): Promise<Address>;
}
