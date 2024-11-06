import { ApiProperty } from '@nestjs/swagger';
import { UpdateFormAnswerDto } from './update-form_answer.dto';

export class UpdateFormAnswerArrayDto {
  @ApiProperty({ type: [UpdateFormAnswerDto], isArray: true })
  fields: UpdateFormAnswerDto[];
}
