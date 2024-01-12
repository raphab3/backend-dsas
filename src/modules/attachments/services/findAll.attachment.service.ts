import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllAttachmentService {
  findAll() {
    return `This action returns all attachment`;
  }
}
