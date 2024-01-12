import { Injectable } from '@nestjs/common';

@Injectable()
export class FindOneAttachmentService {
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
