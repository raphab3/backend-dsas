import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Person Sig ID',
    type: 'string',
    example: 'uuid',
  })
  person_sig_id: string;
}
