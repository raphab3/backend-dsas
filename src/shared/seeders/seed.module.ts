import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { LocationSeedService } from './services/Location.seed.service';
import { Module } from '@nestjs/common';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { SyncPermissionsInRolesService } from './services/SyncPermissionsInRoles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { SyncPermissionsService } from './services/SyncPermissions.service';
import { GenerateRolesService } from './services/GenerateRoles.service';
import { DistributionsLocationsForAllPersonsSigService } from './services/distributionsLocationsForAllPersonsSig.service';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Cid } from '@modules/cids/entities/cid.entity';
import { ImportCidsService } from '@modules/cids/services/import-cids.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Role, Permission, PersonSig, Cid]),
  ],
  providers: [
    LocationSeedService,
    SyncPermissionsInRolesService,
    SyncPermissionsService,
    GenerateRolesService,
    DistributionsLocationsForAllPersonsSigService,
    ImportCidsService,
  ],
})
export class SeedModule {}
