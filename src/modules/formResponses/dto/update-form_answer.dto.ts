import { ApiProperty } from '@nestjs/swagger';

export class UpdateFormAnswerDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  value: string;
}
