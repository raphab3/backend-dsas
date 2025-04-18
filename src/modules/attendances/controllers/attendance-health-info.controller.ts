import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateAttendanceHealthInfoDto } from '../dto/update-attendance-health-info.dto';
import { UpdateAttendanceHealthInfoService } from '../services/update-attendance-health-info.service';

@ApiTags('Attendances')
@Controller('attendances/health-info')
export class AttendanceHealthInfoController {
  constructor(
    private readonly updateAttendanceHealthInfoService: UpdateAttendanceHealthInfoService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Atualizar informações de saúde do atendimento (alergias e doenças crônicas)',
  })
  async updateHealthInfo(@Body() dto: UpdateAttendanceHealthInfoDto) {
    return this.updateAttendanceHealthInfoService.execute(dto);
  }
}
