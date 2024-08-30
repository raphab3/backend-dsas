import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';

export class CreateTraineeDto {
  @ApiProperty({
    description: 'The name of the trainee',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the trainee',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The birthday of the trainee (YYYY-MM-DD)',
    example: '2000-01-01',
  })
  @IsDateString()
  birthday: string;

  @ApiProperty({
    description: 'Sexo do estagiário',
    example: 'M',
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'The phone number of the trainee',
    example: '11999990000',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description:
      'The CPF (Brazilian individual taxpayer registry) of the trainee - 11 digits without punctuation',
    example: '12345678900',
  })
  @IsString()
  @Length(11, 11, { message: 'O CPF deve conter 11 dígitos' })
  @Matches(/^\d+$/, { message: 'O CPF deve conter apenas dígitos' })
  cpf: string;

  @ApiProperty({
    description: 'The start date of the traineeship (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'The end date of the traineeship (optional)',
    example: '2023-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'The educational institution of the trainee',
    example: 'University of Example',
  })
  @IsString()
  institution: string;

  @ApiProperty({
    description: 'The course of study',
    example: 'Computer Science',
  })
  @IsString()
  course: string;

  @ApiProperty({
    description: 'The current semester of the trainee',
    example: 3,
  })
  @IsNumber()
  semester: number;

  @ApiProperty({
    description: 'The UUID of the supervisor (Professional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  supervisorId: string;
}
