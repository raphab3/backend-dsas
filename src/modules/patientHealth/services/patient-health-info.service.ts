import { Injectable } from '@nestjs/common';
import { PatientHealthInfoDto } from '../dto/patient-health-info.dto';
import { AllergyService } from './allergy.service';
import { ChronicConditionService } from './chronic-condition.service';

@Injectable()
export class PatientHealthInfoService {
  constructor(
    private allergyService: AllergyService,
    private chronicConditionService: ChronicConditionService,
  ) {}

  async updatePatientHealthInfo(dto: PatientHealthInfoDto) {
    const results = {
      allergies: [],
      chronicConditions: [],
    };

    // Processar alergias simples
    if (dto.allergies && dto.allergies.length > 0) {
      const allergies = await this.allergyService.createMany(
        dto.patientId,
        dto.allergies,
        dto.attendanceId,
        dto.professionalId,
      );
      results.allergies.push(...allergies);
    }

    // Processar alergias detalhadas
    if (dto.detailedAllergies && dto.detailedAllergies.length > 0) {
      for (const allergyDto of dto.detailedAllergies) {
        // Garantir que o patientId seja o mesmo do DTO principal
        allergyDto.patientId = dto.patientId;
        
        // Usar o attendanceId e professionalId do DTO principal se não fornecidos
        if (!allergyDto.attendanceId) {
          allergyDto.attendanceId = dto.attendanceId;
        }
        if (!allergyDto.professionalId) {
          allergyDto.professionalId = dto.professionalId;
        }

        const allergy = await this.allergyService.create(allergyDto);
        results.allergies.push(allergy);
      }
    }

    // Processar doenças crônicas simples
    if (dto.chronicConditions && dto.chronicConditions.length > 0) {
      const conditions = await this.chronicConditionService.createMany(
        dto.patientId,
        dto.chronicConditions,
        dto.attendanceId,
        dto.professionalId,
      );
      results.chronicConditions.push(...conditions);
    }

    // Processar doenças crônicas detalhadas
    if (dto.detailedChronicConditions && dto.detailedChronicConditions.length > 0) {
      for (const conditionDto of dto.detailedChronicConditions) {
        // Garantir que o patientId seja o mesmo do DTO principal
        conditionDto.patientId = dto.patientId;
        
        // Usar o attendanceId e professionalId do DTO principal se não fornecidos
        if (!conditionDto.attendanceId) {
          conditionDto.attendanceId = dto.attendanceId;
        }
        if (!conditionDto.professionalId) {
          conditionDto.professionalId = dto.professionalId;
        }

        const condition = await this.chronicConditionService.create(conditionDto);
        results.chronicConditions.push(condition);
      }
    }

    return results;
  }

  async getPatientHealthInfo(patientId: string) {
    const allergies = await this.allergyService.findByPatient(patientId);
    const chronicConditions = await this.chronicConditionService.findByPatient(patientId);

    return {
      allergies,
      chronicConditions,
    };
  }
}
