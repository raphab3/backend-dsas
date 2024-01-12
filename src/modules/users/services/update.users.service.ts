import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUsersService {
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
