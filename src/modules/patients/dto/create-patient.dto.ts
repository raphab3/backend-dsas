import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The matricula of the patient',
    type: 'string',
    example: '123456',
  })
  matricula: string;
}
