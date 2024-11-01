import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryFormAnswerDto extends IQuery {
  @ApiProperty({
    description: 'Nome do attendance_answer',
    example: '123456',
    type: String,
    required: false,
  })
  name: string;
}
