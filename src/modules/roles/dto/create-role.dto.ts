import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    type: 'string',
    example: 'admin',
  })
  name?: string;

  @ApiProperty({
    description: 'The description of the role',
    type: 'string',
    example: 'Administrator',
  })
  description?: string;

  @ApiProperty({
    description: 'The permissions of the role',
    type: 'array',
    example: ['create', 'read', 'update', 'delete'],
  })
  permissions?: any[];
}
