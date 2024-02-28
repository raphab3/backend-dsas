import UsersRepository from '@modules/users/typeorm/repositories/UsersRepository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PERMISSIONS_KEY } from '@shared/decorators/Permission';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = await this.usersRepository.getUserWithRolesAndPermissions(
      request?.user?.userId,
    );

    if (!user) return false;

    const permissionsSet = new Set<string>();

    user.individual_permissions?.forEach((permission) => {
      permissionsSet.add(permission.name);
    });

    user.roles?.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionsSet.add(permission.name);
      });
    });

    console.log('requiredPermission: ', requiredPermission);
    console.log('permissionsSet: ', permissionsSet);

    return permissionsSet.has(requiredPermission);
  }
}
