/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  // Aqui você pode adicionar lógica adicional se necessário
  handleRequest(err: any, user: any, _info: any, _context: any) {
    if (err || !user) {
      // Lida com erro ou usuário não autenticado
      throw err || new UnauthorizedException();
    }
    console.log(user);

    return user;
  }
}
