import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllAuditService } from '@modules/audits/services/findAll.Audit.service';
import { Controller, Get, Req } from '@nestjs/common';
import { Permission } from '@modules/permissions/decorators';

@ApiTags('audits')
@Controller('audits')
@ApiBearerAuth('JWT')
export class AuditController {
  constructor(private readonly findAllAuditService: FindAllAuditService) {}

  @Permission('list_audits')
  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllAuditService.findAll(query);
  }
}
