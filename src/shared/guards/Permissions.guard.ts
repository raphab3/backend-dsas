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

    const hasIndividualPermission = user?.individual_permissions?.some(
      (permission) => permission.name === requiredPermission,
    );

    const hasRolePermission = user?.roles?.some((role) =>
      role.permissions.some(
        (permission) => permission.name === requiredPermission,
      ),
    );

    return hasIndividualPermission || hasRolePermission;
  }
}
