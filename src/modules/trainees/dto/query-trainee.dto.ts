import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';
import { IsString } from 'class-validator';

export class QueryTraineeDto extends IQuery {
  @ApiProperty({
    description: 'The name of the trainee',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'The CPF (Brazilian individual taxpayer registry) of the trainee - 11 digits without punctuation',
    example: '12345678900',
  })
  @IsString()
  cpf: string;

  @ApiProperty({
    description: 'The email of the trainee',
  })
  @IsString()
  matricula: string;
}
