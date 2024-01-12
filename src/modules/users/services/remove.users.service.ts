import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveUsersService {
  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
