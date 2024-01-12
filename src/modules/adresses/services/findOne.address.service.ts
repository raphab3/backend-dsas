import { Injectable } from '@nestjs/common';

@Injectable()
export class FindOneAddressService {
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
