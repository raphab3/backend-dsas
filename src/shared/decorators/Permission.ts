import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permission = (permissions: string) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
