import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientMedication } from '../entities/medication.entity';
import { CreateMedicationDto, UpdateMedicationDto } from '../dto/medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(PatientMedication)
    private medicationRepository: Repository<PatientMedication>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<PatientMedication> {
    const medication = this.medicationRepository.create({
      patient: { id: createMedicationDto.patientId },
      medicationName: createMedicationDto.medicationName,
      dosage: createMedicationDto.dosage,
      frequency: createMedicationDto.frequency,
      route: createMedicationDto.route,
      instructions: createMedicationDto.instructions,
      status: createMedicationDto.status,
      startDate: createMedicationDto.startDate,
      endDate: createMedicationDto.endDate,
      isActive: createMedicationDto.isActive ?? true,
      reportedDuring: createMedicationDto.attendanceId 
        ? { id: createMedicationDto.attendanceId } 
        : null,
      prescribedBy: createMedicationDto.professionalId 
        ? { id: createMedicationDto.professionalId } 
        : null,
    });

    return this.medicationRepository.save(medication);
  }

  async createMany(
    patientId: string, 
    medications: { 
      name: string, 
      dosage?: string, 
      frequency?: string 
    }[], 
    attendanceId?: string, 
    professionalId?: string
  ): Promise<PatientMedication[]> {
    const medicationEntities = medications.map(med => 
      this.medicationRepository.create({
        patient: { id: patientId },
        medicationName: med.name,
        dosage: med.dosage,
        frequency: med.frequency as any,
        isActive: true,
        reportedDuring: attendanceId ? { id: attendanceId } : null,
        prescribedBy: professionalId ? { id: professionalId } : null,
      })
    );

    return this.medicationRepository.save(medicationEntities);
  }

  async findAll(): Promise<PatientMedication[]> {
    return this.medicationRepository.find({
      relations: ['patient', 'reportedDuring', 'prescribedBy'],
    });
  }

  async findByPatient(patientId: string): Promise<PatientMedication[]> {
    return this.medicationRepository.find({
      where: { patient: { id: patientId } },
      relations: ['reportedDuring', 'prescribedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByPatient(patientId: string): Promise<PatientMedication[]> {
    return this.medicationRepository.find({
      where: { 
        patient: { id: patientId },
        isActive: true 
      },
      relations: ['reportedDuring', 'prescribedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PatientMedication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['patient', 'reportedDuring', 'prescribedBy'],
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto): Promise<PatientMedication> {
    const medication = await this.findOne(id);
    
    Object.assign(medication, updateMedicationDto);
    
    return this.medicationRepository.save(medication);
  }

  async deactivate(id: string): Promise<PatientMedication> {
    const medication = await this.findOne(id);
    
    medication.isActive = false;
    
    return this.medicationRepository.save(medication);
  }

  async remove(id: string): Promise<void> {
    const medication = await this.findOne(id);
    
    await this.medicationRepository.remove(medication);
  }
}
