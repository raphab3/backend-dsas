import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveAddressService {
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
