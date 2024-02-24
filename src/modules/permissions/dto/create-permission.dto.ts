import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of the permission',
    type: 'string',
    example: 'list_all_users',
  })
  name?: string;

  @ApiProperty({
    description: 'The description of the permission',
    type: 'string',
    example: 'List all users in the system',
  })
  description?: string;
}
