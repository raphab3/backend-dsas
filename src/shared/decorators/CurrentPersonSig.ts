import { createParamDecorator } from '@nestjs/common';

export const CurrentPersonSigId = createParamDecorator((data: unknown, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.personSigId;
});
