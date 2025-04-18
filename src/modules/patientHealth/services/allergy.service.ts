import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientAllergy } from '../entities/allergy.entity';
import { CreateAllergyDto } from '../dto/create-allergy.dto';
import { UpdateAllergyDto } from '../dto/update-allergy.dto';

@Injectable()
export class AllergyService {
  constructor(
    @InjectRepository(PatientAllergy)
    private allergyRepository: Repository<PatientAllergy>,
  ) {}

  async create(createAllergyDto: CreateAllergyDto): Promise<PatientAllergy> {
    const allergy = this.allergyRepository.create({
      patient: { id: createAllergyDto.patientId },
      allergen: createAllergyDto.allergen,
      severity: createAllergyDto.severity,
      reaction: createAllergyDto.reaction,
      isActive: true,
      reportedDuring: createAllergyDto.attendanceId 
        ? { id: createAllergyDto.attendanceId } 
        : null,
      reportedBy: createAllergyDto.professionalId 
        ? { id: createAllergyDto.professionalId } 
        : null,
    });

    return this.allergyRepository.save(allergy);
  }

  async createMany(
    patientId: string, 
    allergens: string[], 
    attendanceId?: string, 
    professionalId?: string
  ): Promise<PatientAllergy[]> {
    const allergies = allergens.map(allergen => 
      this.allergyRepository.create({
        patient: { id: patientId },
        allergen,
        isActive: true,
        reportedDuring: attendanceId ? { id: attendanceId } : null,
        reportedBy: professionalId ? { id: professionalId } : null,
      })
    );

    return this.allergyRepository.save(allergies);
  }

  async findAll(): Promise<PatientAllergy[]> {
    return this.allergyRepository.find({
      relations: ['patient', 'reportedDuring', 'reportedBy'],
    });
  }

  async findByPatient(patientId: string): Promise<PatientAllergy[]> {
    return this.allergyRepository.find({
      where: { 
        patient: { id: patientId },
        isActive: true,
      },
      relations: ['reportedDuring', 'reportedBy'],
    });
  }

  async findOne(id: string): Promise<PatientAllergy> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['patient', 'reportedDuring', 'reportedBy'],
    });

    if (!allergy) {
      throw new NotFoundException(`Alergia com ID ${id} não encontrada`);
    }

    return allergy;
  }

  async update(id: string, updateAllergyDto: UpdateAllergyDto): Promise<PatientAllergy> {
    const allergy = await this.findOne(id);

    // Atualizar apenas os campos fornecidos
    if (updateAllergyDto.allergen !== undefined) {
      allergy.allergen = updateAllergyDto.allergen;
    }
    if (updateAllergyDto.severity !== undefined) {
      allergy.severity = updateAllergyDto.severity;
    }
    if (updateAllergyDto.reaction !== undefined) {
      allergy.reaction = updateAllergyDto.reaction;
    }
    if (updateAllergyDto.isActive !== undefined) {
      allergy.isActive = updateAllergyDto.isActive;
    }

    return this.allergyRepository.save(allergy);
  }

  async remove(id: string): Promise<void> {
    const allergy = await this.findOne(id);
    await this.allergyRepository.remove(allergy);
  }

  async deactivate(id: string): Promise<PatientAllergy> {
    const allergy = await this.findOne(id);
    allergy.isActive = false;
    return this.allergyRepository.save(allergy);
  }
}
