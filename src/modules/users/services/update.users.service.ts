import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUsersService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, _updateUserDto: any) {
    return `This action updates a #${id} user`;
  }
}
