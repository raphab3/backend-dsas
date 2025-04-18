import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChronicCondition,
  ConditionStatus,
} from '../entities/chronicCondition.entity';
import { CreateChronicConditionDto } from '../dto/create-chronic-condition.dto';
import { UpdateChronicConditionDto } from '../dto/update-chronic-condition.dto';

@Injectable()
export class ChronicConditionService {
  constructor(
    @InjectRepository(ChronicCondition)
    private conditionRepository: Repository<ChronicCondition>,
  ) {}

  async create(
    createConditionDto: CreateChronicConditionDto,
  ): Promise<ChronicCondition> {
    const condition = this.conditionRepository.create({
      patient: { id: createConditionDto.patientId },
      condition: createConditionDto.condition,
      status: createConditionDto.status,
      notes: createConditionDto.notes,
      diagnosedAt: createConditionDto.diagnosedAt
        ? new Date(createConditionDto.diagnosedAt)
        : null,
      reportedDuring: createConditionDto.attendanceId
        ? { id: createConditionDto.attendanceId }
        : null,
      reportedBy: createConditionDto.professionalId
        ? { id: createConditionDto.professionalId }
        : null,
    });

    return this.conditionRepository.save(condition);
  }

  async createMany(
    patientId: string,
    conditions: string[],
    attendanceId?: string,
    professionalId?: string,
  ): Promise<ChronicCondition[]> {
    const chronicConditions = conditions.map((condition) =>
      this.conditionRepository.create({
        patient: { id: patientId },
        condition,
        reportedDuring: attendanceId ? { id: attendanceId } : null,
        reportedBy: professionalId ? { id: professionalId } : null,
      }),
    );

    return this.conditionRepository.save(chronicConditions);
  }

  async findAll(): Promise<ChronicCondition[]> {
    return this.conditionRepository.find({
      relations: ['patient', 'reportedDuring', 'reportedBy'],
    });
  }

  async findByPatient(patientId: string): Promise<ChronicCondition[]> {
    return this.conditionRepository.find({
      where: {
        patient: { id: patientId },
        status: ConditionStatus.ACTIVE,
      },
      relations: ['reportedDuring', 'reportedBy'],
    });
  }

  async findOne(id: string): Promise<ChronicCondition> {
    const condition = await this.conditionRepository.findOne({
      where: { id },
      relations: ['patient', 'reportedDuring', 'reportedBy'],
    });

    if (!condition) {
      throw new NotFoundException(
        `Condição crônica com ID ${id} não encontrada`,
      );
    }

    return condition;
  }

  async update(
    id: string,
    updateConditionDto: UpdateChronicConditionDto,
  ): Promise<ChronicCondition> {
    const condition = await this.findOne(id);

    // Atualizar apenas os campos fornecidos
    if (updateConditionDto.condition !== undefined) {
      condition.condition = updateConditionDto.condition;
    }
    if (updateConditionDto.status !== undefined) {
      condition.status = updateConditionDto.status;
    }
    if (updateConditionDto.notes !== undefined) {
      condition.notes = updateConditionDto.notes;
    }
    if (updateConditionDto.diagnosedAt !== undefined) {
      condition.diagnosedAt = new Date(updateConditionDto.diagnosedAt);
    }

    return this.conditionRepository.save(condition);
  }

  async remove(id: string): Promise<void> {
    const condition = await this.findOne(id);
    await this.conditionRepository.remove(condition);
  }

  async markAsResolved(id: string): Promise<ChronicCondition> {
    const condition = await this.findOne(id);
    condition.status = ConditionStatus.RESOLVED;
    return this.conditionRepository.save(condition);
  }
}
