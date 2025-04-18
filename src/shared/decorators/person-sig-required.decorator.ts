import { applyDecorators, UseGuards } from '@nestjs/common';
import { PersonSigGuard } from '@shared/guards/CurrentPersonSig.guard';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';

export function RequirePersonSig() {
  return applyDecorators(UseGuards(JwtAuthGuard, PersonSigGuard));
}
