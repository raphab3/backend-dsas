import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The name of the patient',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
