import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
    type: String,
    required: true,
  })
  password: string;

  @ApiProperty({
    description: 'The old password of the user',
    example: '123456',
    type: String,
    required: true,
  })
  oldPassword: string;
}
