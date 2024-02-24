import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    type: 'string',
    example: 'admin',
  })
  name?: string;
}
