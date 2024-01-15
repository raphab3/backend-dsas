import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto
  implements
    Omit<
      IUser,
      'id' | 'rules' | 'salt' | 'person_sig' | 'created_at' | 'updated_at'
    >
{
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
}
