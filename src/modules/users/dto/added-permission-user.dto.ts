import { ApiProperty } from '@nestjs/swagger';

export class AddedPermissionUserDto {
  @ApiProperty({
    description: 'The permission name',
    type: 'string',
    example: 'create_user',
    required: false,
  })
  permission: string;

  @ApiProperty({
    description: 'The role name',
    type: 'string',
    example: 'admin',
    required: false,
  })
  role: string;
}
