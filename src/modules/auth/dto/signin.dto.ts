import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The email of the user',
    type: 'string',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: 'string',
    example: '123456',
  })
  password: string;
}
