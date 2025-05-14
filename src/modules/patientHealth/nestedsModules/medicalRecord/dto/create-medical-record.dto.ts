import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums
export enum DietType {
  REGULAR = 'regular',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  LOW_CARB = 'low_carb',
  KETOGENIC = 'ketogenic',
  PALEO = 'paleo',
  GLUTEN_FREE = 'gluten_free',
  LACTOSE_FREE = 'lactose_free',
  DASH = 'dash',
  MEDITERRANEAN = 'mediterranean',
  OTHER = 'other',
}

export enum MealRegularity {
  REGULAR = 'regular',
  IRREGULAR = 'irregular',
  INTERMITTENT = 'intermittent',
}

export enum PhysicalActivityFrequency {
  SEDENTARY = 'sedentary',
  OCCASIONAL = 'occasional',
  REGULAR = 'regular',
  INTENSE = 'intense',
}

export enum PhysicalActivityIntensity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  INTENSE = 'intense',
  VARIED = 'varied',
}

export enum LeisureFrequency {
  RARE = 'rare',
  OCCASIONAL = 'occasional',
  FREQUENT = 'frequent',
  DAILY = 'daily',
}

export enum SleepQuality {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent',
}

export enum FrequencyScale {
  NEVER = 'never',
  RARELY = 'rarely',
  FREQUENTLY = 'frequently',
  ALWAYS = 'always',
}

// Nested DTOs
export class SurgeryDto {
  @IsNotEmpty()
  @IsString()
  procedure: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  hospital?: string;

  @IsOptional()
  @IsString()
  doctor?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class MedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}

export class PhysicalExamDto {
  @IsOptional()
  @IsNumber()
  classification?: number;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  findings?: string[];

  @IsOptional()
  @IsNumber()
  muscleStrength?: number;

  @IsOptional()
  @IsString()
  observations?: string;
}

// Main DTO
export class AnamnesisDto {
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  professionalId?: string;

  // Anthropometric Data
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  bmi?: number;

  @IsOptional()
  @IsNumber()
  abdominalCircumference?: number;

  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @IsOptional()
  @IsNumber()
  pulse?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  capillaryGlucose?: number;

  @IsOptional()
  @IsNumber()
  saturation?: number;

  // General Anamnesis - Diet
  @IsOptional()
  @IsEnum(DietType)
  dietType?: DietType;

  @IsOptional()
  @IsEnum(MealRegularity)
  mealRegularity?: MealRegularity;

  @IsOptional()
  @IsNumber()
  mealsPerDay?: number;

  @IsOptional()
  @IsNumber()
  waterConsumption?: number;

  @IsOptional()
  @IsNumber()
  perceivedDietQuality?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  frequentFoods?: string[];

  @IsOptional()
  @IsString()
  dietObservations?: string;

  // General Anamnesis - Physical Activity
  @IsOptional()
  @IsEnum(PhysicalActivityFrequency)
  physicalActivityFrequency?: PhysicalActivityFrequency;

  @IsOptional()
  @IsNumber()
  physicalActivityDuration?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  physicalActivityTypes?: string[];

  @IsOptional()
  @IsEnum(PhysicalActivityIntensity)
  physicalActivityIntensity?: PhysicalActivityIntensity;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  physicalActivityLimitations?: string[];

  @IsOptional()
  @IsString()
  physicalActivityObservations?: string;

  // General Anamnesis - Leisure
  @IsOptional()
  @IsEnum(LeisureFrequency)
  leisureFrequency?: LeisureFrequency;

  @IsOptional()
  @IsNumber()
  leisureDuration?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  leisureActivities?: string[];

  @IsOptional()
  @IsNumber()
  leisureSatisfaction?: number;

  @IsOptional()
  @IsBoolean()
  leisureChangeDesired?: boolean;

  @IsOptional()
  @IsString()
  leisureObservations?: string;

  // General Anamnesis - Sleep
  @IsOptional()
  @IsNumber()
  sleepDuration?: number;

  @IsOptional()
  @IsString()
  sleepTime?: string;

  @IsOptional()
  @IsString()
  wakeTime?: string;

  @IsOptional()
  @IsEnum(SleepQuality)
  sleepQuality?: SleepQuality;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sleepProblems?: string[];

  @IsOptional()
  @IsEnum(FrequencyScale)
  sleepMedicationUse?: FrequencyScale;

  @IsOptional()
  @IsEnum(FrequencyScale)
  nappingHabit?: FrequencyScale;

  @IsOptional()
  @IsEnum(FrequencyScale)
  screenBeforeSleep?: FrequencyScale;

  @IsOptional()
  @IsString()
  sleepObservations?: string;

  // Personal Medical History
  @IsOptional()
  @IsBoolean()
  historyHypertension?: boolean;

  @IsOptional()
  @IsBoolean()
  historyDiabetes?: boolean;

  @IsOptional()
  @IsBoolean()
  historyStroke?: boolean;

  @IsOptional()
  @IsBoolean()
  historyCancer?: boolean;

  @IsOptional()
  @IsBoolean()
  historyHeartDisease?: boolean;

  @IsOptional()
  @IsBoolean()
  historyCovid?: boolean;

  @IsOptional()
  @IsBoolean()
  historyAsthma?: boolean;

  @IsOptional()
  @IsBoolean()
  historyObesity?: boolean;

  @IsOptional()
  @IsBoolean()
  historyDyslipidemia?: boolean;

  @IsOptional()
  @IsBoolean()
  historyAllergies?: boolean;

  @IsOptional()
  @IsBoolean()
  historySmoking?: boolean;

  @IsOptional()
  @IsBoolean()
  historyAlcoholism?: boolean;

  @IsOptional()
  @IsString()
  historyOther?: string;

  // Surgeries
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurgeryDto)
  surgeries?: SurgeryDto[];

  // Medications
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  medications?: MedicationDto[];

  // Vaccination
  @IsOptional()
  @IsBoolean()
  vaccinationCovid?: boolean;

  @IsOptional()
  @IsBoolean()
  vaccinationTetanus?: boolean;

  @IsOptional()
  @IsBoolean()
  vaccinationHepatitisB?: boolean;

  // Family History
  @IsOptional()
  @IsBoolean()
  familyHypertension?: boolean;

  @IsOptional()
  @IsBoolean()
  familyDiabetes?: boolean;

  @IsOptional()
  @IsBoolean()
  familyAsthma?: boolean;

  @IsOptional()
  @IsBoolean()
  familyCancer?: boolean;

  @IsOptional()
  @IsBoolean()
  familyAllergies?: boolean;

  @IsOptional()
  @IsBoolean()
  familyHeartDisease?: boolean;

  @IsOptional()
  @IsBoolean()
  familyStroke?: boolean;

  @IsOptional()
  @IsBoolean()
  familySmoking?: boolean;

  @IsOptional()
  @IsBoolean()
  familyAlcoholism?: boolean;

  @IsOptional()
  @IsBoolean()
  familySedentary?: boolean;

  @IsOptional()
  @IsString()
  familyOther?: string;

  // Habits and Customs
  @IsOptional()
  @IsBoolean()
  socialDrinking?: boolean;

  @IsOptional()
  @IsBoolean()
  chronicDrinking?: boolean;

  @IsOptional()
  @IsBoolean()
  smoking?: boolean;

  @IsOptional()
  @IsBoolean()
  illicitDrugUse?: boolean;

  @IsOptional()
  @IsString()
  habitsObservations?: string;

  // Physical Examination
  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  respiratorySystem?: PhysicalExamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  cardiovascularSystem?: PhysicalExamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  abdomen?: PhysicalExamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  musculoskeletalSystem?: PhysicalExamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  upperLimbs?: PhysicalExamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalExamDto)
  lowerLimbs?: PhysicalExamDto;

  // Requested Exams
  @IsOptional()
  @IsBoolean()
  examCBC?: boolean;

  @IsOptional()
  @IsBoolean()
  examGlucose?: boolean;

  @IsOptional()
  @IsBoolean()
  examGlycatedHemoglobin?: boolean;

  @IsOptional()
  @IsBoolean()
  examTotalCholesterol?: boolean;

  @IsOptional()
  @IsBoolean()
  examTriglycerides?: boolean;

  @IsOptional()
  @IsBoolean()
  examCRP?: boolean;

  @IsOptional()
  @IsBoolean()
  examAST?: boolean;

  @IsOptional()
  @IsBoolean()
  examALT?: boolean;

  @IsOptional()
  @IsBoolean()
  examGammaGT?: boolean;

  @IsOptional()
  @IsBoolean()
  examUrea?: boolean;

  @IsOptional()
  @IsBoolean()
  examCreatinine?: boolean;

  @IsOptional()
  @IsBoolean()
  examUricAcid?: boolean;

  @IsOptional()
  @IsBoolean()
  examPSA?: boolean;

  @IsOptional()
  @IsBoolean()
  examUrinalysis?: boolean;

  @IsOptional()
  @IsBoolean()
  examStoolTest?: boolean;

  @IsOptional()
  @IsBoolean()
  examEchocardiogram?: boolean;

  @IsOptional()
  @IsBoolean()
  examStressTest?: boolean;

  @IsOptional()
  @IsBoolean()
  examAbdominalUltrasound?: boolean;

  @IsOptional()
  @IsBoolean()
  examChestXray?: boolean;

  @IsOptional()
  @IsBoolean()
  examMammography?: boolean;

  @IsOptional()
  @IsString()
  examOther?: string;

  // Additional Observations
  @IsOptional()
  @IsString()
  observations?: string;
}
