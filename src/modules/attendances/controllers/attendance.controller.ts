import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { StartAttendanceService } from '@modules/attendances/services/start.attendance.service';
import {
  FindAllAttendanceService,
  IResponse,
} from '@modules/attendances/services/findAll.attendance.service';
import { FindOneAttendanceService } from '@modules/attendances/services/findOne.attendance.service';
import { RemoveAttendanceService } from '@modules/attendances/services/remove.attendance.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Patch,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { StartAttendanceDto } from '../dto/start-attendance.dto';
import { UpdateStatusAttendanceDto } from '../dto/updateStatus-attendance.dto';
import { UpdateStatusAttendanceService } from '../services/updateStatus.attendance.service';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';
import { CreateAttendanceEvolutionDto } from '../dto/create-attendance-evolution.dto';
import { AddFormResponseDto } from '../dto/add-form-response.dto';
import { UpdateAttendanceSpecialtyLocationDto } from '../dto/update-attendance-specialty-location.dto';
import { AddFormResponseService } from '../services/add-form-response.service';
import { DeleteFormResponseService } from '../services/delete-form-response.service';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { UpdateAttendanceService } from '../services/update.attendance.service';
import { AttendanceAttachmentService } from '../services/attendance-attachment.service';
import { CurrentPersonSigId } from '@shared/decorators/CurrentPersonSig';
import { PersonSigGuard } from '@shared/guards/CurrentPersonSig.guard';

@ApiTags('attendances')
@Controller('attendances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AttendanceController {
  constructor(
    private readonly startAttendanceService: StartAttendanceService,
    private readonly findAllAttendanceService: FindAllAttendanceService,
    private readonly findOneAttendanceService: FindOneAttendanceService,
    private readonly removeAttendanceService: RemoveAttendanceService,
    private readonly updateStatusAttendanceService: UpdateStatusAttendanceService,
    private readonly updateAttendanceService: UpdateAttendanceService,
    private readonly addFormResponseService: AddFormResponseService,
    private readonly deleteFormResponseService: DeleteFormResponseService,
    private readonly attendanceAttachmentService: AttendanceAttachmentService,
  ) {}

  @Post('start')
  @AuditLog('INICIAR ATENDIMENTO')
  @ApiOperation({ summary: 'Start Attendance' })
  @Permission(PermissionsEnum.create_attendance)
  create(@Body() startAttendanceDto: StartAttendanceDto) {
    return this.startAttendanceService.execute(startAttendanceDto);
  }

  @Post(':id/form-response')
  @AuditLog('ADICIONAR FORMULÁRIO')
  @ApiOperation({ summary: 'Add Form Response to Attendance' })
  @Permission(PermissionsEnum.update_attendance)
  async addFormResponse(
    @Param('id') id: string,
    @Body() data: AddFormResponseDto,
  ) {
    return this.addFormResponseService.execute({ ...data, attendanceId: id });
  }

  @Patch(':id/status')
  @AuditLog('ATUALIZAR STATUS')
  @ApiOperation({ summary: 'Update Attendance Status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusAttendanceDto: UpdateStatusAttendanceDto,
  ) {
    return this.updateStatusAttendanceService.execute(
      id,
      updateStatusAttendanceDto,
    );
  }

  @Patch(':id/evolution')
  @AuditLog('ATUALIZAR EVOLUÇÃO')
  @ApiOperation({ summary: 'Update Attendance Evolution' })
  @Permission(PermissionsEnum.update_attendance)
  async updateEvolution(
    @Param('id') id: string,
    @Body() data: CreateAttendanceEvolutionDto,
  ) {
    return this.updateAttendanceService.updateEvolution(id, data);
  }

  @Patch(':id/specialty-location')
  @AuditLog('ATUALIZAR ESPECIALIDADE E LOCAL')
  @ApiOperation({ summary: 'Update Attendance Specialty and Location' })
  @Permission(PermissionsEnum.update_attendance)
  async updateSpecialtyLocation(
    @Param('id') id: string,
    @Body() data: UpdateAttendanceSpecialtyLocationDto,
  ) {
    return this.updateAttendanceService.updateSpecialtyLocation(id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Attendance' })
  @Permission(PermissionsEnum.find_all_attendances)
  findAll(
    @Query() query: QueryAttendanceDto,
    @CurrentPersonSigId() personSigId: string,
  ): Promise<any> {
    query.personSigId = personSigId;
    return this.findAllAttendanceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Attendance' })
  @Permission(PermissionsEnum.find_one_attendance)
  findOne(@Param('id') id: string): Promise<any> {
    return this.findOneAttendanceService.findOne(id);
  }

  @Delete(':id')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove Attendance' })
  @Permission(PermissionsEnum.remove_attendance)
  remove(@Param('id') id: string) {
    return this.removeAttendanceService.remove(id);
  }

  @Delete(':attendanceId/form-response/:formResponseId')
  @AuditLog('REMOVER FORMULÁRIO')
  @ApiOperation({ summary: 'Delete Form Response from Attendance' })
  @Permission(PermissionsEnum.update_attendance)
  async deleteFormResponse(
    @Param('attendanceId') attendanceId: string,
    @Param('formResponseId') formResponseId: string,
  ) {
    return this.deleteFormResponseService.execute(attendanceId, formResponseId);
  }

  @Get('history/patient/:patientId')
  @ApiOperation({ summary: 'Get patient attendance history' })
  @Permission(PermissionsEnum.find_all_attendances)
  async getPatientHistory(
    @Param('patientId') patientId: string,
    @Query() query: QueryAttendanceDto,
  ): Promise<IPaginatedResult<IResponse>> {
    return this.findAllAttendanceService.findAll({
      ...query,
      patientId,
      perPage: query.perPage || 100,
    });
  }

  @Post(':id/attachments')
  @ApiOperation({ summary: 'Upload attachment to attendance' })
  @Permission(PermissionsEnum.update_attendance)
  @UseGuards(PersonSigGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 1024 * 1024 * 10 } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to be uploaded',
        },
      },
    },
  })
  @AuditLog('UPLOAD ANEXO')
  async uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentPersonSigId() personSigId: string,
  ) {
    return this.attendanceAttachmentService.uploadAttachment(
      id,
      file,
      personSigId,
    );
  }

  @Get(':id/attachments')
  @ApiOperation({ summary: 'Get attendance attachments' })
  @Permission(PermissionsEnum.find_one_attendance)
  async getAttachments(@Param('id') id: string) {
    return this.attendanceAttachmentService.getAttachmentsByAttendanceId(id);
  }

  @Delete(':attendanceId/attachments/:attachmentId')
  @ApiOperation({ summary: 'Delete attachment from attendance' })
  @Permission(PermissionsEnum.update_attendance)
  @AuditLog('REMOVER ANEXO')
  async deleteAttachment(
    @Param('attendanceId') attendanceId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.attendanceAttachmentService.deleteAttachment(
      attendanceId,
      attachmentId,
    );
  }
}
