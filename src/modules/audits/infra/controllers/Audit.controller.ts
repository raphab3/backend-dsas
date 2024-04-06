import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllAuditService } from '@modules/audits/services/findAll.Audit.service';
import { Controller, Get, Query } from '@nestjs/common';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { IQueryAudit } from '@modules/audits/dto/IQueryAudit';

@ApiTags('audits')
@Controller('audits')
@ApiBearerAuth('JWT')
export class AuditController {
  constructor(private readonly findAllAuditService: FindAllAuditService) {}

  @Get()
  @Permission(PermissionsEnum.find_all_audits)
  findAll(@Query() query: IQueryAudit) {
    return this.findAllAuditService.findAll(query);
  }
}
