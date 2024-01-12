import { FindOneUsersService } from '@modules/users/services/findOne.users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  constructor(private findOneUsersService: FindOneUsersService) {}

  async execute(id: string): Promise<any> {
    console.log('MeService -> execute -> id', id);
    if (!id) {
      throw new Error('User not found');
    }

    const user = await this.findOneUsersService.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
