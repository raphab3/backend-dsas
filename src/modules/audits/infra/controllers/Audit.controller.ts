import { ApiTags } from '@nestjs/swagger';
import { FindAllAuditService } from '@modules/audits/services/findAll.Audit.service';
import { Controller, Get, Req } from '@nestjs/common';

@ApiTags('Audit')
@Controller('Audit')
export class AuditController {
  constructor(private readonly findAllAuditService: FindAllAuditService) {}

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllAuditService.findAll(query);
  }
}
