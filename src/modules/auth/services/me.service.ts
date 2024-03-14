import { IUser } from '@modules/users/interfaces/IUser';
import { FindOneUsersService } from '@modules/users/services/findOne.users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  constructor(private findOneUsersService: FindOneUsersService) {}

  async execute(id: string): Promise<any> {
    if (!id) {
      throw new Error('User not found');
    }

    const user: IUser = await this.findOneUsersService.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    console.log('user: ', user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user?.roles,
      locations: user?.person_sig?.locations,
    };
  }
}
