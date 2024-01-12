import CryptoHashProvider from '@shared/providers/HashProvider/implementations/CryptoHashProvider';
import env from '@config/env';
import { AuthController } from './infra/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwt-strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@modules/users/users.module';
import { MeService } from './services/me.service';
import { FindOneUsersService } from '@modules/users/services/findOne.users.service';

const JWT_CONFIG = JwtModule.register({
  global: true,
  secret: env.JWT_SECRET,
  signOptions: { expiresIn: '60s' },
});

@Module({
  imports: [UsersModule, PassportModule, JWT_CONFIG],
  providers: [
    AuthService,
    MeService,
    FindOneUsersService,
    CryptoHashProvider,
    {
      provide: 'HashProvider',
      useExisting: CryptoHashProvider,
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
