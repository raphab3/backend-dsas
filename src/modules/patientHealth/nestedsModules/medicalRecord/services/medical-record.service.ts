import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../entities/medical-record.entity';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';
import { AnamnesisDto } from '../dto/create-medical-record.dto';
import { Attendance } from '@modules/attendances/entities/attendance.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  /**
   * Create a new medical record or update an existing one
   * @param createMedicalRecordDto - The data to create/update the medical record
   * @returns The created or updated medical record
   */
  async create(createMedicalRecordDto: AnamnesisDto): Promise<MedicalRecord> {
    // If professionalId is not provided, try to get it from the attendance
    let professionalId = createMedicalRecordDto.professionalId;

    if (!professionalId) {
      // Find the attendance to get the professional ID
      const attendance = await this.attendanceRepository.findOne({
        where: { id: createMedicalRecordDto.attendanceId },
        relations: ['professional'],
      });

      if (attendance && attendance.professional) {
        professionalId = attendance.professional.id;
      }
    }

    if (!professionalId) {
      throw new NotFoundException(
        `Professional not found for attendance ${createMedicalRecordDto.attendanceId}`,
      );
    }

    // Check if a medical record already exists for this attendance
    let medicalRecord: MedicalRecord;
    try {
      medicalRecord = await this.medicalRecordRepository.findOne({
        where: { attendanceId: createMedicalRecordDto.attendanceId },
      });
    } catch (error) {
      // If there's an error finding the record, assume it doesn't exist
      medicalRecord = null;
    }

    if (medicalRecord) {
      // If a record exists, update its basic information
      medicalRecord.patient = { id: createMedicalRecordDto.patientId } as any;
      medicalRecord.patientId = createMedicalRecordDto.patientId;
      medicalRecord.professional = { id: professionalId } as any;
      medicalRecord.professionalId = professionalId;
    } else {
      // If no record exists, create a new one
      medicalRecord = this.medicalRecordRepository.create({
        attendance: { id: createMedicalRecordDto.attendanceId },
        attendanceId: createMedicalRecordDto.attendanceId,
        patient: { id: createMedicalRecordDto.patientId },
        patientId: createMedicalRecordDto.patientId,
        professional: { id: professionalId },
        professionalId: professionalId,
      });
    }

    // Set anthropometric data
    if (createMedicalRecordDto.weight) {
      medicalRecord.weight = createMedicalRecordDto.weight;
    }
    if (createMedicalRecordDto.height) {
      medicalRecord.height = createMedicalRecordDto.height;
    }
    if (createMedicalRecordDto.bmi) {
      medicalRecord.bmi = createMedicalRecordDto.bmi;
    }
    if (createMedicalRecordDto.abdominalCircumference) {
      medicalRecord.abdominalCircumference =
        createMedicalRecordDto.abdominalCircumference;
    }
    if (createMedicalRecordDto.bloodPressure) {
      medicalRecord.bloodPressure = createMedicalRecordDto.bloodPressure;
    }
    if (createMedicalRecordDto.pulse) {
      medicalRecord.pulse = createMedicalRecordDto.pulse;
    }
    if (createMedicalRecordDto.temperature) {
      medicalRecord.temperature = createMedicalRecordDto.temperature;
    }
    if (createMedicalRecordDto.capillaryGlucose) {
      medicalRecord.capillaryGlucose = createMedicalRecordDto.capillaryGlucose;
    }
    if (createMedicalRecordDto.saturation) {
      medicalRecord.saturation = createMedicalRecordDto.saturation;
    }

    // Set diet information
    if (createMedicalRecordDto.dietType) {
      medicalRecord.dietType = createMedicalRecordDto.dietType;
    }
    if (createMedicalRecordDto.mealRegularity) {
      medicalRecord.mealRegularity = createMedicalRecordDto.mealRegularity;
    }
    if (createMedicalRecordDto.mealsPerDay) {
      medicalRecord.mealsPerDay = createMedicalRecordDto.mealsPerDay;
    }
    if (createMedicalRecordDto.waterConsumption) {
      medicalRecord.waterConsumption = createMedicalRecordDto.waterConsumption;
    }
    if (createMedicalRecordDto.perceivedDietQuality) {
      medicalRecord.perceivedDietQuality =
        createMedicalRecordDto.perceivedDietQuality;
    }
    if (createMedicalRecordDto.frequentFoods) {
      medicalRecord.frequentFoods = createMedicalRecordDto.frequentFoods;
    }
    if (createMedicalRecordDto.dietObservations) {
      medicalRecord.dietObservations = createMedicalRecordDto.dietObservations;
    }

    // Set physical activity information
    if (createMedicalRecordDto.physicalActivityFrequency) {
      medicalRecord.physicalActivityFrequency =
        createMedicalRecordDto.physicalActivityFrequency;
    }
    if (createMedicalRecordDto.physicalActivityDuration) {
      medicalRecord.physicalActivityDuration =
        createMedicalRecordDto.physicalActivityDuration;
    }
    if (createMedicalRecordDto.physicalActivityTypes) {
      medicalRecord.physicalActivityTypes =
        createMedicalRecordDto.physicalActivityTypes;
    }
    if (createMedicalRecordDto.physicalActivityIntensity) {
      medicalRecord.physicalActivityIntensity =
        createMedicalRecordDto.physicalActivityIntensity;
    }
    if (createMedicalRecordDto.physicalActivityLimitations) {
      medicalRecord.physicalActivityLimitations =
        createMedicalRecordDto.physicalActivityLimitations;
    }
    if (createMedicalRecordDto.physicalActivityObservations) {
      medicalRecord.physicalActivityObservations =
        createMedicalRecordDto.physicalActivityObservations;
    }

    // Set leisure information
    if (createMedicalRecordDto.leisureFrequency) {
      medicalRecord.leisureFrequency = createMedicalRecordDto.leisureFrequency;
    }
    if (createMedicalRecordDto.leisureDuration) {
      medicalRecord.leisureDuration = createMedicalRecordDto.leisureDuration;
    }
    if (createMedicalRecordDto.leisureActivities) {
      medicalRecord.leisureActivities =
        createMedicalRecordDto.leisureActivities;
    }
    if (createMedicalRecordDto.leisureSatisfaction) {
      medicalRecord.leisureSatisfaction =
        createMedicalRecordDto.leisureSatisfaction;
    }
    if (createMedicalRecordDto.leisureChangeDesired !== undefined) {
      medicalRecord.leisureChangeDesired =
        createMedicalRecordDto.leisureChangeDesired;
    }
    if (createMedicalRecordDto.leisureObservations) {
      medicalRecord.leisureObservations =
        createMedicalRecordDto.leisureObservations;
    }

    // Set sleep information
    if (createMedicalRecordDto.sleepDuration) {
      medicalRecord.sleepDuration = createMedicalRecordDto.sleepDuration;
    }
    if (createMedicalRecordDto.sleepTime) {
      medicalRecord.sleepTime = createMedicalRecordDto.sleepTime;
    }
    if (createMedicalRecordDto.wakeTime) {
      medicalRecord.wakeTime = createMedicalRecordDto.wakeTime;
    }
    if (createMedicalRecordDto.sleepQuality) {
      medicalRecord.sleepQuality = createMedicalRecordDto.sleepQuality;
    }
    if (createMedicalRecordDto.sleepProblems) {
      medicalRecord.sleepProblems = createMedicalRecordDto.sleepProblems;
    }
    if (createMedicalRecordDto.sleepMedicationUse) {
      medicalRecord.sleepMedicationUse =
        createMedicalRecordDto.sleepMedicationUse;
    }
    if (createMedicalRecordDto.nappingHabit) {
      medicalRecord.nappingHabit = createMedicalRecordDto.nappingHabit;
    }
    if (createMedicalRecordDto.screenBeforeSleep) {
      medicalRecord.screenBeforeSleep =
        createMedicalRecordDto.screenBeforeSleep;
    }
    if (createMedicalRecordDto.sleepObservations) {
      medicalRecord.sleepObservations =
        createMedicalRecordDto.sleepObservations;
    }

    // Set personal medical history
    if (createMedicalRecordDto.historyHypertension !== undefined) {
      medicalRecord.historyHypertension =
        createMedicalRecordDto.historyHypertension;
    }
    if (createMedicalRecordDto.historyDiabetes !== undefined) {
      medicalRecord.historyDiabetes = createMedicalRecordDto.historyDiabetes;
    }
    if (createMedicalRecordDto.historyAsthma !== undefined) {
      medicalRecord.historyAsthma = createMedicalRecordDto.historyAsthma;
    }
    if (createMedicalRecordDto.historyCancer !== undefined) {
      medicalRecord.historyCancer = createMedicalRecordDto.historyCancer;
    }
    if (createMedicalRecordDto.historyAllergies !== undefined) {
      medicalRecord.historyAllergies = createMedicalRecordDto.historyAllergies;
    }
    if (createMedicalRecordDto.historyHeartDisease !== undefined) {
      medicalRecord.historyHeartDisease =
        createMedicalRecordDto.historyHeartDisease;
    }
    if (createMedicalRecordDto.historyStroke !== undefined) {
      medicalRecord.historyStroke = createMedicalRecordDto.historyStroke;
    }
    if (createMedicalRecordDto.historyObesity !== undefined) {
      medicalRecord.historyObesity = createMedicalRecordDto.historyObesity;
    }
    if (createMedicalRecordDto.historyDyslipidemia !== undefined) {
      medicalRecord.historyDyslipidemia =
        createMedicalRecordDto.historyDyslipidemia;
    }
    if (createMedicalRecordDto.historyAlcoholism !== undefined) {
      medicalRecord.historyAlcoholism =
        createMedicalRecordDto.historyAlcoholism;
    }
    if (createMedicalRecordDto.historySmoking !== undefined) {
      medicalRecord.historySmoking = createMedicalRecordDto.historySmoking;
    }
    if (createMedicalRecordDto.historyCovid !== undefined) {
      medicalRecord.historyCovid = createMedicalRecordDto.historyCovid;
    }
    if (createMedicalRecordDto.historyOther) {
      medicalRecord.historyOther = createMedicalRecordDto.historyOther;
    }

    // Set surgeries
    if (createMedicalRecordDto.surgeries) {
      medicalRecord.surgeries = createMedicalRecordDto.surgeries.map(
        (surgery) => ({
          procedure: surgery.procedure,
          date: surgery.date || '', // Provide default empty string if date is missing
          hospital: surgery.hospital,
          doctor: surgery.doctor,
          observations: surgery.observations,
        }),
      );
    }

    // Set medications
    if (createMedicalRecordDto.medications) {
      medicalRecord.medications = createMedicalRecordDto.medications.map(
        (med) => ({
          name: med.name,
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          observations: med.observations,
        }),
      );
    }

    // Set vaccination
    if (createMedicalRecordDto.vaccinationCovid !== undefined) {
      medicalRecord.vaccinationCovid = createMedicalRecordDto.vaccinationCovid;
    }
    if (createMedicalRecordDto.vaccinationTetanus !== undefined) {
      medicalRecord.vaccinationTetanus =
        createMedicalRecordDto.vaccinationTetanus;
    }
    if (createMedicalRecordDto.vaccinationHepatitisB !== undefined) {
      medicalRecord.vaccinationHepatitisB =
        createMedicalRecordDto.vaccinationHepatitisB;
    }

    // Set family history
    if (createMedicalRecordDto.familyHypertension !== undefined) {
      medicalRecord.familyHypertension =
        createMedicalRecordDto.familyHypertension;
    }
    if (createMedicalRecordDto.familyDiabetes !== undefined) {
      medicalRecord.familyDiabetes = createMedicalRecordDto.familyDiabetes;
    }
    if (createMedicalRecordDto.familyAsthma !== undefined) {
      medicalRecord.familyAsthma = createMedicalRecordDto.familyAsthma;
    }
    if (createMedicalRecordDto.familyCancer !== undefined) {
      medicalRecord.familyCancer = createMedicalRecordDto.familyCancer;
    }
    if (createMedicalRecordDto.familyAllergies !== undefined) {
      medicalRecord.familyAllergies = createMedicalRecordDto.familyAllergies;
    }
    if (createMedicalRecordDto.familyHeartDisease !== undefined) {
      medicalRecord.familyHeartDisease =
        createMedicalRecordDto.familyHeartDisease;
    }
    if (createMedicalRecordDto.familyStroke !== undefined) {
      medicalRecord.familyStroke = createMedicalRecordDto.familyStroke;
    }
    if (createMedicalRecordDto.familySmoking !== undefined) {
      medicalRecord.familySmoking = createMedicalRecordDto.familySmoking;
    }
    if (createMedicalRecordDto.familyAlcoholism !== undefined) {
      medicalRecord.familyAlcoholism = createMedicalRecordDto.familyAlcoholism;
    }
    if (createMedicalRecordDto.familySedentary !== undefined) {
      medicalRecord.familySedentary = createMedicalRecordDto.familySedentary;
    }
    if (createMedicalRecordDto.familyOther) {
      medicalRecord.familyOther = createMedicalRecordDto.familyOther;
    }

    // Set habits and customs
    if (createMedicalRecordDto.socialDrinking !== undefined) {
      medicalRecord.socialDrinking = createMedicalRecordDto.socialDrinking;
    }
    if (createMedicalRecordDto.chronicDrinking !== undefined) {
      medicalRecord.chronicDrinking = createMedicalRecordDto.chronicDrinking;
    }
    if (createMedicalRecordDto.smoking !== undefined) {
      medicalRecord.smoking = createMedicalRecordDto.smoking;
    }
    if (createMedicalRecordDto.illicitDrugUse !== undefined) {
      medicalRecord.illicitDrugUse = createMedicalRecordDto.illicitDrugUse;
    }
    if (createMedicalRecordDto.habitsObservations) {
      medicalRecord.habitsObservations =
        createMedicalRecordDto.habitsObservations;
    }

    // Set physical examination
    if (createMedicalRecordDto.respiratorySystem) {
      medicalRecord.respiratorySystem = {
        classification:
          createMedicalRecordDto.respiratorySystem.classification || 0,
        findings: createMedicalRecordDto.respiratorySystem.findings,
        observations: createMedicalRecordDto.respiratorySystem.observations,
      };
    }
    if (createMedicalRecordDto.cardiovascularSystem) {
      medicalRecord.cardiovascularSystem = {
        classification:
          createMedicalRecordDto.cardiovascularSystem.classification || 0,
        findings: createMedicalRecordDto.cardiovascularSystem.findings,
        observations: createMedicalRecordDto.cardiovascularSystem.observations,
      };
    }
    if (createMedicalRecordDto.abdomen) {
      medicalRecord.abdomen = {
        classification: createMedicalRecordDto.abdomen.classification || 0,
        findings: createMedicalRecordDto.abdomen.findings,
        observations: createMedicalRecordDto.abdomen.observations,
      };
    }
    if (createMedicalRecordDto.musculoskeletalSystem) {
      medicalRecord.musculoskeletalSystem = {
        classification:
          createMedicalRecordDto.musculoskeletalSystem.classification || 0,
        findings: createMedicalRecordDto.musculoskeletalSystem.findings,
        muscleStrength:
          createMedicalRecordDto.musculoskeletalSystem.muscleStrength,
        observations: createMedicalRecordDto.musculoskeletalSystem.observations,
      };
    }
    if (createMedicalRecordDto.upperLimbs) {
      medicalRecord.upperLimbs = {
        classification: createMedicalRecordDto.upperLimbs.classification || 0,
        findings: createMedicalRecordDto.upperLimbs.findings,
        observations: createMedicalRecordDto.upperLimbs.observations,
      };
    }
    if (createMedicalRecordDto.lowerLimbs) {
      medicalRecord.lowerLimbs = {
        classification: createMedicalRecordDto.lowerLimbs.classification || 0,
        findings: createMedicalRecordDto.lowerLimbs.findings,
        observations: createMedicalRecordDto.lowerLimbs.observations,
      };
    }

    // Set requested exams
    if (createMedicalRecordDto.examCBC !== undefined) {
      medicalRecord.examCBC = createMedicalRecordDto.examCBC;
    }
    if (createMedicalRecordDto.examGlucose !== undefined) {
      medicalRecord.examGlucose = createMedicalRecordDto.examGlucose;
    }
    if (createMedicalRecordDto.examGlycatedHemoglobin !== undefined) {
      medicalRecord.examGlycatedHemoglobin =
        createMedicalRecordDto.examGlycatedHemoglobin;
    }
    if (createMedicalRecordDto.examTotalCholesterol !== undefined) {
      medicalRecord.examTotalCholesterol =
        createMedicalRecordDto.examTotalCholesterol;
    }
    if (createMedicalRecordDto.examTriglycerides !== undefined) {
      medicalRecord.examTriglycerides =
        createMedicalRecordDto.examTriglycerides;
    }
    if (createMedicalRecordDto.examCRP !== undefined) {
      medicalRecord.examCRP = createMedicalRecordDto.examCRP;
    }

    // Generate anamnesis text and set as observations
    medicalRecord.observations = this.generateAnamnesisText(
      createMedicalRecordDto,
    );

    // Save the medical record
    const savedRecord = await this.medicalRecordRepository.save(medicalRecord);

    // Log whether this was a create or update operation
    console.log(
      `Medical record ${medicalRecord.id ? 'updated' : 'created'} for attendance ${createMedicalRecordDto.attendanceId}`,
    );

    return savedRecord;
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      relations: ['attendance', 'patient', 'professional'],
    });
  }

  async findOne(id: string): Promise<MedicalRecord> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: ['attendance', 'patient', 'professional'],
    });

    if (!medicalRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }

    return medicalRecord;
  }

  async findByAttendance(attendanceId: string): Promise<MedicalRecord | null> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { attendance: { id: attendanceId } },
      relations: ['attendance', 'patient', 'professional'],
    });

    return medicalRecord || null;
  }

  async findByPatient(patientId: string): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { patient: { id: patientId } },
      relations: ['attendance', 'professional'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const medicalRecord = await this.findOne(id);

    // Update the entity with the new data
    // This is a simplified approach - in a real implementation, you would need to handle
    // the mapping of DTO fields to entity fields similar to the create method
    Object.assign(medicalRecord, updateMedicalRecordDto);

    return this.medicalRecordRepository.save(medicalRecord);
  }

  async remove(id: string): Promise<void> {
    const medicalRecord = await this.findOne(id);
    await this.medicalRecordRepository.remove(medicalRecord);
  }
  // Helper methods for mapping and formatting data
  private mapDietTypeToFeedingQuality(dietType: string): string {
    // Map diet type to feeding quality enum
    const dietQualityMap = {
      regular: 'REGULAR',
      vegetarian: 'GOOD',
      vegan: 'GOOD',
      low_carb: 'GOOD',
      ketogenic: 'GOOD',
      paleo: 'GOOD',
      gluten_free: 'REGULAR',
      lactose_free: 'REGULAR',
      dash: 'GOOD',
      mediterranean: 'GOOD',
      other: 'REGULAR',
    };

    return dietQualityMap[dietType] || 'REGULAR';
  }

  private formatDietObservations(dto: AnamnesisDto): string {
    let observations = '';

    if (dto.dietType) {
      observations += `Diet Type: ${dto.dietType}\n`;
    }

    if (dto.mealRegularity) {
      observations += `Meal Regularity: ${dto.mealRegularity}\n`;
    }

    if (dto.mealsPerDay) {
      observations += `Meals Per Day: ${dto.mealsPerDay}\n`;
    }

    if (dto.waterConsumption) {
      observations += `Water Consumption: ${dto.waterConsumption} liters/day\n`;
    }

    if (dto.frequentFoods && dto.frequentFoods.length > 0) {
      observations += `Frequent Foods: ${dto.frequentFoods.join(', ')}\n`;
    }

    if (dto.dietObservations) {
      observations += `Additional Observations: ${dto.dietObservations}\n`;
    }

    return observations;
  }

  private mapPhysicalActivityFrequencyToEnum(frequency: string): string {
    const activityMap = {
      sedentary: 'SEDENTARY',
      occasional: 'LIGHT',
      regular: 'MODERATE',
      intense: 'INTENSE',
    };

    return activityMap[frequency] || 'SEDENTARY';
  }

  private formatPhysicalActivityObservations(dto: AnamnesisDto): string {
    let observations = '';

    if (dto.physicalActivityFrequency) {
      observations += `Frequency: ${dto.physicalActivityFrequency}\n`;
    }

    if (dto.physicalActivityDuration) {
      observations += `Duration: ${dto.physicalActivityDuration} minutes/session\n`;
    }

    if (dto.physicalActivityTypes && dto.physicalActivityTypes.length > 0) {
      observations += `Types: ${dto.physicalActivityTypes.join(', ')}\n`;
    }

    if (dto.physicalActivityIntensity) {
      observations += `Intensity: ${dto.physicalActivityIntensity}\n`;
    }

    if (
      dto.physicalActivityLimitations &&
      dto.physicalActivityLimitations.length > 0
    ) {
      observations += `Limitations: ${dto.physicalActivityLimitations.join(', ')}\n`;
    }

    if (dto.physicalActivityObservations) {
      observations += `Additional Observations: ${dto.physicalActivityObservations}\n`;
    }

    return observations;
  }

  private mapLeisureFrequencyToQuality(frequency: string): string {
    const leisureMap = {
      rare: 'POOR',
      occasional: 'REGULAR',
      frequent: 'GOOD',
      daily: 'GOOD',
    };

    return leisureMap[frequency] || 'REGULAR';
  }

  private formatLeisureObservations(dto: AnamnesisDto): string {
    let observations = '';

    if (dto.leisureFrequency) {
      observations += `Frequency: ${dto.leisureFrequency}\n`;
    }

    if (dto.leisureDuration) {
      observations += `Duration: ${dto.leisureDuration} hours/week\n`;
    }

    if (dto.leisureActivities && dto.leisureActivities.length > 0) {
      observations += `Activities: ${dto.leisureActivities.join(', ')}\n`;
    }

    if (dto.leisureSatisfaction) {
      observations += `Satisfaction Level: ${dto.leisureSatisfaction}/10\n`;
    }

    if (dto.leisureChangeDesired !== undefined) {
      observations += `Desires Change: ${dto.leisureChangeDesired ? 'Yes' : 'No'}\n`;
    }

    if (dto.leisureObservations) {
      observations += `Additional Observations: ${dto.leisureObservations}\n`;
    }

    return observations;
  }

  private mapSleepQualityToEnum(quality: string): string {
    const sleepMap = {
      poor: 'POOR',
      fair: 'REGULAR',
      good: 'GOOD',
      excellent: 'GOOD',
    };

    return sleepMap[quality] || 'REGULAR';
  }

  private formatSleepObservations(dto: AnamnesisDto): string {
    let observations = '';

    if (dto.sleepDuration) {
      observations += `Duration: ${dto.sleepDuration} hours/night\n`;
    }

    if (dto.sleepTime) {
      observations += `Sleep Time: ${dto.sleepTime}\n`;
    }

    if (dto.wakeTime) {
      observations += `Wake Time: ${dto.wakeTime}\n`;
    }

    if (dto.sleepQuality) {
      observations += `Quality: ${dto.sleepQuality}\n`;
    }

    if (dto.sleepProblems && dto.sleepProblems.length > 0) {
      observations += `Problems: ${dto.sleepProblems.join(', ')}\n`;
    }

    if (dto.sleepMedicationUse) {
      observations += `Medication Use: ${dto.sleepMedicationUse}\n`;
    }

    if (dto.nappingHabit) {
      observations += `Napping Habit: ${dto.nappingHabit}\n`;
    }

    if (dto.screenBeforeSleep) {
      observations += `Screen Before Sleep: ${dto.screenBeforeSleep}\n`;
    }

    if (dto.sleepObservations) {
      observations += `Additional Observations: ${dto.sleepObservations}\n`;
    }

    return observations;
  }

  private determineAlcoholUse(
    socialDrinking: boolean,
    chronicDrinking: boolean,
  ): string {
    if (chronicDrinking) {
      return 'CHRONIC';
    } else if (socialDrinking) {
      return 'SOCIAL';
    } else {
      return 'NONE';
    }
  }

  private mapPhysicalExamFindings(findings: string[]): string[] {
    // This is a simplified implementation
    // In a real scenario, you would map the findings to the appropriate enum values
    return findings || [];
  }

  private generateAnamnesisText(dto: AnamnesisDto): string {
    // Generate a comprehensive anamnesis text from all the data
    // This is a simplified implementation
    let anamnesisText = 'MEDICAL ANAMNESIS\n\n';

    // Add anthropometric data
    if (
      dto.weight ||
      dto.height ||
      dto.bmi ||
      dto.abdominalCircumference ||
      dto.bloodPressure ||
      dto.pulse ||
      dto.temperature ||
      dto.capillaryGlucose ||
      dto.saturation
    ) {
      anamnesisText += 'ANTHROPOMETRIC DATA:\n';
      if (dto.weight) anamnesisText += `Weight: ${dto.weight} kg\n`;
      if (dto.height) anamnesisText += `Height: ${dto.height} cm\n`;
      if (dto.bmi) anamnesisText += `BMI: ${dto.bmi}\n`;
      if (dto.abdominalCircumference)
        anamnesisText += `Abdominal Circumference: ${dto.abdominalCircumference} cm\n`;
      if (dto.bloodPressure)
        anamnesisText += `Blood Pressure: ${dto.bloodPressure}\n`;
      if (dto.pulse) anamnesisText += `Pulse: ${dto.pulse} bpm\n`;
      if (dto.temperature)
        anamnesisText += `Temperature: ${dto.temperature} °C\n`;
      if (dto.capillaryGlucose)
        anamnesisText += `Capillary Glucose: ${dto.capillaryGlucose} mg/dL\n`;
      if (dto.saturation)
        anamnesisText += `Oxygen Saturation: ${dto.saturation}%\n`;
      anamnesisText += '\n';
    }

    // Add diet information
    if (
      dto.dietType ||
      dto.mealRegularity ||
      dto.mealsPerDay ||
      dto.waterConsumption ||
      dto.frequentFoods ||
      dto.dietObservations
    ) {
      anamnesisText += 'DIET:\n';
      anamnesisText += this.formatDietObservations(dto);
      anamnesisText += '\n';
    }

    // Add physical activity information
    if (
      dto.physicalActivityFrequency ||
      dto.physicalActivityDuration ||
      dto.physicalActivityTypes ||
      dto.physicalActivityIntensity ||
      dto.physicalActivityLimitations ||
      dto.physicalActivityObservations
    ) {
      anamnesisText += 'PHYSICAL ACTIVITY:\n';
      anamnesisText += this.formatPhysicalActivityObservations(dto);
      anamnesisText += '\n';
    }

    // Add leisure information
    if (
      dto.leisureFrequency ||
      dto.leisureDuration ||
      dto.leisureActivities ||
      dto.leisureSatisfaction !== undefined ||
      dto.leisureChangeDesired !== undefined ||
      dto.leisureObservations
    ) {
      anamnesisText += 'LEISURE:\n';
      anamnesisText += this.formatLeisureObservations(dto);
      anamnesisText += '\n';
    }

    // Add sleep information
    if (
      dto.sleepDuration ||
      dto.sleepTime ||
      dto.wakeTime ||
      dto.sleepQuality ||
      dto.sleepProblems ||
      dto.sleepMedicationUse ||
      dto.nappingHabit ||
      dto.screenBeforeSleep ||
      dto.sleepObservations
    ) {
      anamnesisText += 'SLEEP:\n';
      anamnesisText += this.formatSleepObservations(dto);
      anamnesisText += '\n';
    }

    // Add personal medical history
    anamnesisText += 'PERSONAL MEDICAL HISTORY:\n';
    if (dto.historyHypertension) anamnesisText += '- Hypertension\n';
    if (dto.historyDiabetes) anamnesisText += '- Diabetes\n';
    if (dto.historyAsthma) anamnesisText += '- Asthma\n';
    if (dto.historyCancer) anamnesisText += '- Cancer/Neoplasms\n';
    if (dto.historyAllergies) anamnesisText += '- Allergies\n';
    if (dto.historyHeartDisease) anamnesisText += '- Heart Disease\n';
    if (dto.historyStroke) anamnesisText += '- Stroke\n';
    if (dto.historyObesity) anamnesisText += '- Obesity\n';
    if (dto.historyDyslipidemia) anamnesisText += '- Dyslipidemia\n';
    if (dto.historyAlcoholism) anamnesisText += '- Alcoholism\n';
    if (dto.historySmoking) anamnesisText += '- Smoking\n';
    if (dto.historyCovid) anamnesisText += '- COVID-19\n';
    if (dto.historyOther) anamnesisText += `Other: ${dto.historyOther}\n`;
    anamnesisText += '\n';

    // Add surgeries
    if (dto.surgeries && dto.surgeries.length > 0) {
      anamnesisText += 'SURGERIES:\n';
      dto.surgeries.forEach((surgery, index) => {
        anamnesisText += `${index + 1}. ${surgery.procedure}`;
        if (surgery.date) anamnesisText += ` (${surgery.date})`;
        if (surgery.hospital) anamnesisText += ` at ${surgery.hospital}`;
        if (surgery.doctor) anamnesisText += ` by Dr. ${surgery.doctor}`;
        anamnesisText += '\n';
        if (surgery.observations)
          anamnesisText += `   Observations: ${surgery.observations}\n`;
      });
      anamnesisText += '\n';
    }

    // Add medications
    if (dto.medications && dto.medications.length > 0) {
      anamnesisText += 'MEDICATIONS:\n';
      dto.medications.forEach((medication, index) => {
        anamnesisText += `${index + 1}. ${medication.name}`;
        if (medication.dosage) anamnesisText += ` ${medication.dosage}`;
        if (medication.frequency) anamnesisText += ` ${medication.frequency}`;
        anamnesisText += '\n';
        if (medication.observations)
          anamnesisText += `   Observations: ${medication.observations}\n`;
      });
      anamnesisText += '\n';
    }

    // Add vaccination
    anamnesisText += 'VACCINATION:\n';
    if (dto.vaccinationCovid) anamnesisText += '- COVID-19\n';
    if (dto.vaccinationTetanus) anamnesisText += '- Tetanus\n';
    if (dto.vaccinationHepatitisB) anamnesisText += '- Hepatitis B\n';
    anamnesisText += '\n';

    // Add family history
    anamnesisText += 'FAMILY HISTORY:\n';
    if (dto.familyHypertension) anamnesisText += '- Hypertension\n';
    if (dto.familyDiabetes) anamnesisText += '- Diabetes\n';
    if (dto.familyAsthma) anamnesisText += '- Asthma\n';
    if (dto.familyCancer) anamnesisText += '- Cancer/Neoplasms\n';
    if (dto.familyAllergies) anamnesisText += '- Allergies\n';
    if (dto.familyHeartDisease) anamnesisText += '- Heart Disease\n';
    if (dto.familyStroke) anamnesisText += '- Stroke\n';
    if (dto.familySmoking) anamnesisText += '- Smoking\n';
    if (dto.familyAlcoholism) anamnesisText += '- Alcoholism\n';
    if (dto.familySedentary) anamnesisText += '- Sedentary Lifestyle\n';
    if (dto.familyOther) anamnesisText += `Other: ${dto.familyOther}\n`;
    anamnesisText += '\n';

    // Add habits and customs
    anamnesisText += 'HABITS AND CUSTOMS:\n';
    if (dto.socialDrinking || dto.chronicDrinking) {
      if (dto.chronicDrinking) {
        anamnesisText += '- Chronic Alcohol Use\n';
      } else if (dto.socialDrinking) {
        anamnesisText += '- Social Alcohol Use\n';
      } else {
        anamnesisText += '- No Alcohol Use\n';
      }
    }
    if (dto.smoking !== undefined) {
      anamnesisText += dto.smoking ? '- Current Smoker\n' : '- Non-Smoker\n';
    }
    if (dto.illicitDrugUse !== undefined) {
      anamnesisText += dto.illicitDrugUse
        ? '- Illicit Drug Use\n'
        : '- No Illicit Drug Use\n';
    }
    if (dto.habitsObservations) {
      anamnesisText += `Observations: ${dto.habitsObservations}\n`;
    }

    return anamnesisText;
  }
}
