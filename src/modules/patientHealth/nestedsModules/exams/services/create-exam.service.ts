import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { ExamType } from '../entities/exam-type.entity';
import { CreateExamDto } from '../dto/create-exam.dto';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';

@Injectable()
export class CreateExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async execute(createExamDto: CreateExamDto): Promise<Exam> {
    // Verificar se o tipo de exame existe
    const examType = await this.examTypeRepository.findOne({
      where: { id: createExamDto.examTypeId },
    });
    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado');
    }

    // Verificar se o paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: createExamDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Verificar se o profissional existe
    const professional = await this.professionalRepository.findOne({
      where: { id: createExamDto.professionalId },
    });
    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    // Verificar se o atendimento existe
    const attendance = await this.attendanceRepository.findOne({
      where: { id: createExamDto.attendanceId },
    });
    if (!attendance) {
      throw new NotFoundException('Atendimento não encontrado');
    }

    // Criar e salvar o exame
    const exam = this.examRepository.create({
      examType,
      patient,
      professional,
      attendance,
      requestDate: new Date(createExamDto.requestDate),
      instructions: createExamDto.instructions,
    });

    return this.examRepository.save(exam);
  }
}
