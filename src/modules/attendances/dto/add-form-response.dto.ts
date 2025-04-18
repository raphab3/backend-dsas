import { ApiProperty } from '@nestjs/swagger';

export class AddFormResponseDto {
  @ApiProperty({
    description: 'Form Template ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  formTemplateId: string;

  @ApiProperty({
    description: 'Attendance ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  attendanceId: string;
}
