import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: 'string',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Nome obrigatório' })
  name: string;

  @ApiProperty({
    description: 'The password of the user',
    type: 'string',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Senha obrigatória' })
  password: string;

  @ApiProperty({
    description: 'The roles of the user',
    type: 'array',
    example: ['admin', 'user'],
    required: false,
  })
  roles?: string[];
}
