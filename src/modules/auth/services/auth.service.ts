import { FindByEmailUsersService } from '@modules/users/services/findByEmail.users.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import IHashProvider from '@shared/providers/HashProvider/interfaces/IHashProvider';

@Injectable()
export class AuthService {
  constructor(
    private findByEmailUsersService: FindByEmailUsersService,
    private jwtService: JwtService,
    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.findByEmailUsersService.execute(email);

    const passwordMatched = await this.hashProvider.compareHash(
      pass,
      user.password,
      user.salt,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
