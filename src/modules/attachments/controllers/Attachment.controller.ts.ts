import CreateAttachmentService from '../services/CreateAttachment.service';
import DeleteAttachmentService from '../services/DeleteAttachment.service';
import ListAttachmentsService from '../services/ListAttachments.service';
import { AttachmentsEnuns, AttachmentsType } from '../interfaces/IAttachment';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryAttachmentDto } from '../dtos/QueryAttachmentDto';
import { ParamsAttachmentDto } from '../dtos/ParamsAttachmentDto';
import { storageConfig } from '@config/uploadConfig';

@ApiTags('attachments')
@ApiBearerAuth('JWT')
@Controller('/attachments')
export default class AttachmentController {
  constructor(
    private listAttachmentsService: ListAttachmentsService,
    private createAttachmentService: CreateAttachmentService,
    private deleteAttachmentService: DeleteAttachmentService,
  ) {}

  @Get('/')
  public async index(@Query() query: QueryAttachmentDto) {
    const attachments = await this.listAttachmentsService.execute(query);
    return attachments;
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create an attachment',
    description: 'Uploads an attachment to the server.',
  })
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
        type: {
          type: 'string',
          enum: [...AttachmentsEnuns],
          description: 'Attachment type',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig,
    }),
  )
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: AttachmentsType },
  ) {
    await this.createAttachmentService.execute({
      file,
      attachment_type: body.type,
    });
  }

  @Delete('/:uuid')
  public async delete(@Param() params: ParamsAttachmentDto) {
    const { uuid } = params;
    await this.deleteAttachmentService.execute(uuid);
  }
}
