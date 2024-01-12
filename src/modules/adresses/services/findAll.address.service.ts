import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllAddressService {
  async execute(): Promise<any> {
    return { msg: 'This action returns all address' };
  }
}
