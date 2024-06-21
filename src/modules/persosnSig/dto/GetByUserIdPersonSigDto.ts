import { ApiProperty } from '@nestjs/swagger';

export class GetByUserIdPersonSigDto {
  @ApiProperty({
    description: 'The user id to filter the resources',
    required: true,
  })
  userId: string;
}
