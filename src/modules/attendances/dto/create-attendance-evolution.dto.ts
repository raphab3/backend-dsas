import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAttendanceEvolutionDto {
  @ApiProperty({
    description: 'Conteúdo da evolução',
    example: 'Paciente apresentou melhora significativa...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
