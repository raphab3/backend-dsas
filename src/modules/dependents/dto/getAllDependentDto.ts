import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class GetAllDependentDto extends IQuery {
  @ApiProperty({
    description: 'The name of the dependent',
    type: 'string',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The cpf of the dependent',
    type: 'string',
    required: false,
  })
  cpf?: string;
}
