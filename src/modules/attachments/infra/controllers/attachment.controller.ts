import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAttachmentDto } from '@modules/attachments/dto/create-attachment.dto';
import { CreateAttachmentService } from '@modules/attachments/services/create.attachment.service';
import { FindAllAttachmentService } from '@modules/attachments/services/findAll.attachment.service';
import { FindOneAttachmentService } from '@modules/attachments/services/findOne.attachment.service';
import { RemoveAttachmentService } from '@modules/attachments/services/remove.attachment.service';
import { UpdateAttachmentDto } from '@modules/attachments/dto/update-attachment.dto';
import { UpdateAttachmentService } from '@modules/attachments/services/update.attachment.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController {
  constructor(
    private readonly createAttachmentService: CreateAttachmentService,
    private readonly findAllAttachmentService: FindAllAttachmentService,
    private readonly findOneAttachmentService: FindOneAttachmentService,
    private readonly updateAttachmentService: UpdateAttachmentService,
    private readonly removeAttachmentService: RemoveAttachmentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Attachment' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.createAttachmentService.execute(createAttachmentDto);
  }

  @Get()
  findAll() {
    return this.findAllAttachmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Attachment' })
  findOne(@Param('id') id: string) {
    return this.findOneAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
  ) {
    return this.updateAttachmentService.update(+id, updateAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeAttachmentService.remove(+id);
  }
}
