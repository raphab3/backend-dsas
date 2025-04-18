import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { PersonSigGuard } from './CurrentPersonSig.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [PersonSigGuard],
  exports: [PersonSigGuard],
})
export class GuardModule {}
