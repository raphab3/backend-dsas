import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import LocationRepository from '@modules/locations/typeorm/repositories/LocationRepository';

@Injectable()
export class LocationsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private locationRepository: LocationRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireLocations = this.reflector.get<boolean>(
      'locations',
      context.getHandler(),
    );

    if (!requireLocations) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const locations = await this.locationRepository.list({
      userId: request.user.userId,
      perPage: 999999999,
    });

    const userLocations = locations.data.map((loc) => loc.id);
    request.userLocations = userLocations;

    if (!request.query.locations) {
      return true;
    }

    const requestedLocations = request.query.locations || [];
    const hasPermission = requestedLocations.every((locationId) =>
      userLocations.includes(locationId),
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        'Acesso não autorizado às localizações solicitadas.',
      );
    }

    return true;
  }
}
