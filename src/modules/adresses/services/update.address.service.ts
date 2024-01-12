import { Injectable } from '@nestjs/common';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class UpdateAddressService {
  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} Address`;
  }
}
