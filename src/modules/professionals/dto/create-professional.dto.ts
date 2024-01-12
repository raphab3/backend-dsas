import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalDto {
  @ApiProperty({
    description: 'The name of the professional',
    type: 'string',
    example: 'John Doe',
  })
  crm?: string;
}
