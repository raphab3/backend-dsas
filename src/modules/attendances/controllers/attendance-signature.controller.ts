import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { AttendanceSignatureService } from '../services/attendance-signature.service';
import { SignAttendancePdfDto } from '../dto/sign-attendance-pdf.dto';
import { AuditLog } from '@modules/audits/decorators';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('attendance-signatures')
@Controller('attendances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AttendanceSignatureController {
  constructor(
    private readonly attendanceSignatureService: AttendanceSignatureService,
  ) {}

  @Post(':id/sign')
  @AuditLog('ASSINAR ATENDIMENTO')
  @ApiOperation({
    summary: 'Sign an attendance PDF with a digital certificate',
  })
  @ApiResponse({
    status: 200,
    description: 'The attendance has been successfully signed',
  })
  @Permission(PermissionsEnum.update_attendance)
  async signAttendance(
    @Param('id') id: string,
    @Body() signAttendancePdfDto: SignAttendancePdfDto,
    @Req() req: any,
  ) {
    return this.attendanceSignatureService.signAttendancePdf({
      attendanceId: id,
      userId: req.user.userId,
      certificateId: signAttendancePdfDto.certificateId,
      password: signAttendancePdfDto.password,
      includeEvolution: signAttendancePdfDto.includeEvolution,
      reason: signAttendancePdfDto.reason,
      signaturePosition: signAttendancePdfDto.signaturePosition,
    });
  }

  @Get(':id/signatures')
  @ApiOperation({ summary: 'Get all signatures for an attendance' })
  @ApiResponse({
    status: 200,
    description: 'List of signatures for the attendance',
  })
  @Permission(PermissionsEnum.find_one_attendance)
  async getAttendanceSignatures(@Param('id') id: string) {
    return this.attendanceSignatureService.getAttendanceSignatures(id);
  }

  @Get(':id/verify')
  @ApiOperation({ summary: 'Verify signatures for an attendance' })
  @ApiResponse({
    status: 200,
    description: 'Verification result for the attendance signatures',
  })
  @Permission(PermissionsEnum.find_one_attendance)
  async verifyAttendanceSignatures(@Param('id') id: string) {
    return this.attendanceSignatureService.verifySignedPdf(id);
  }

  @Get('signatures/:signatureId')
  @ApiOperation({ summary: 'Get a signature by ID' })
  @ApiResponse({
    status: 200,
    description: 'The signature details',
  })
  @Permission(PermissionsEnum.find_one_attendance)
  async getSignature(@Param('signatureId') signatureId: string) {
    return this.attendanceSignatureService.getSignatureById(signatureId);
  }

  @Get('signatures/:signatureId/download')
  @ApiOperation({ summary: 'Get a download URL for a signed attendance PDF' })
  @ApiResponse({
    status: 200,
    description: 'The download URL for the signed PDF',
  })
  @Permission(PermissionsEnum.find_one_attendance)
  async getSignedDocumentUrl(@Param('signatureId') signatureId: string) {
    const url =
      await this.attendanceSignatureService.getSignedDocumentUrl(signatureId);
    return { url };
  }

  @Post('signatures/:signatureId/delete')
  @AuditLog('DELETAR ASSINATURA DE ATENDIMENTO')
  @ApiOperation({ summary: 'Delete a signature' })
  @ApiResponse({
    status: 200,
    description: 'The signature has been successfully deleted',
  })
  @Permission(PermissionsEnum.update_attendance)
  async deleteSignature(
    @Param('signatureId') signatureId: string,
    @Req() req: any,
  ) {
    await this.attendanceSignatureService.deleteSignature(
      signatureId,
      req.user.userId,
    );
    return { message: 'Signature deleted successfully' };
  }
}
