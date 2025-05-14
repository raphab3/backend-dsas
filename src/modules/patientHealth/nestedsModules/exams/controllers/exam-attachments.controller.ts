import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { ExamAttachmentService } from '../services/exam-attachment.service';
import { CurrentPersonSigId } from '@shared/decorators/CurrentPersonSig';

@ApiTags('exam-attachments')
@Controller('exams/:examId/attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ExamAttachmentsController {
  constructor(private readonly examAttachmentService: ExamAttachmentService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file to an exam' })
  @ApiConsumes('multipart/form-data')
  @Permission(PermissionsEnum.create_exam)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('examId') examId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx|xls|xlsx|txt)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentPersonSigId() personSigId: string,
  ) {
    return this.examAttachmentService.uploadAttachment(
      examId,
      file,
      personSigId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments for an exam' })
  @Permission(PermissionsEnum.read_exam)
  async getAttachments(@Param('examId') examId: string) {
    return this.examAttachmentService.getAttachments(examId);
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Delete an attachment' })
  @Permission(PermissionsEnum.update_exam)
  async deleteAttachment(
    @Param('examId') examId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.examAttachmentService.deleteAttachment(attachmentId);
  }
}
