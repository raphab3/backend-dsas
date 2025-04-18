import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadAttachmentDto {
  @ApiProperty({
    description: 'Attendance ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  attendanceId: string;

  @ApiProperty({
    description: 'File to upload',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
