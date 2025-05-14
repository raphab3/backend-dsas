import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Attendance)
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  @Column({ name: 'attendance_id' })
  attendanceId: string;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column({ name: 'professional_id' })
  professionalId: string;

  // Anthropometric Data
  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  bmi: number;

  @Column({ name: 'abdominal_circumference', type: 'float', nullable: true })
  abdominalCircumference: number;

  @Column({ name: 'blood_pressure', nullable: true })
  bloodPressure: string;

  @Column({ type: 'int', nullable: true })
  pulse: number;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ name: 'capillary_glucose', type: 'int', nullable: true })
  capillaryGlucose: number;

  @Column({ type: 'int', nullable: true })
  saturation: number;

  // General Anamnesis
  // Diet information
  @Column({ name: 'diet_type', nullable: true })
  dietType: string;

  @Column({ name: 'meal_regularity', nullable: true })
  mealRegularity: string;

  @Column({ name: 'meals_per_day', type: 'int', nullable: true })
  mealsPerDay: number;

  @Column({ name: 'water_consumption', type: 'float', nullable: true })
  waterConsumption: number;

  @Column({ name: 'perceived_diet_quality', type: 'int', nullable: true })
  perceivedDietQuality: number;

  @Column({ name: 'frequent_foods', type: 'simple-array', nullable: true })
  frequentFoods: string[];

  @Column({ name: 'diet_observations', nullable: true })
  dietObservations: string;

  // Physical Activity
  @Column({ name: 'physical_activity_frequency', nullable: true })
  physicalActivityFrequency: string;

  @Column({ name: 'physical_activity_duration', type: 'int', nullable: true })
  physicalActivityDuration: number;

  @Column({
    name: 'physical_activity_types',
    type: 'simple-array',
    nullable: true,
  })
  physicalActivityTypes: string[];

  @Column({ name: 'physical_activity_intensity', nullable: true })
  physicalActivityIntensity: string;

  @Column({
    name: 'physical_activity_limitations',
    type: 'simple-array',
    nullable: true,
  })
  physicalActivityLimitations: string[];

  @Column({ name: 'physical_activity_observations', nullable: true })
  physicalActivityObservations: string;

  // Leisure
  @Column({ name: 'leisure_frequency', nullable: true })
  leisureFrequency: string;

  @Column({ name: 'leisure_duration', type: 'int', nullable: true })
  leisureDuration: number;

  @Column({ name: 'leisure_activities', type: 'simple-array', nullable: true })
  leisureActivities: string[];

  @Column({ name: 'leisure_satisfaction', type: 'int', nullable: true })
  leisureSatisfaction: number;

  @Column({ name: 'leisure_change_desired', type: 'boolean', nullable: true })
  leisureChangeDesired: boolean;

  @Column({ name: 'leisure_observations', nullable: true })
  leisureObservations: string;

  // Sleep
  @Column({ name: 'sleep_duration', type: 'float', nullable: true })
  sleepDuration: number;

  @Column({ name: 'sleep_time', nullable: true })
  sleepTime: string;

  @Column({ name: 'wake_time', nullable: true })
  wakeTime: string;

  @Column({ name: 'sleep_quality', nullable: true })
  sleepQuality: string;

  @Column({ name: 'sleep_problems', type: 'simple-array', nullable: true })
  sleepProblems: string[];

  @Column({ name: 'sleep_medication_use', nullable: true })
  sleepMedicationUse: string;

  @Column({ name: 'napping_habit', nullable: true })
  nappingHabit: string;

  @Column({ name: 'screen_before_sleep', nullable: true })
  screenBeforeSleep: string;

  @Column({ name: 'sleep_observations', nullable: true })
  sleepObservations: string;

  // Personal Medical History
  @Column({ name: 'history_hypertension', type: 'boolean', default: false })
  historyHypertension: boolean;

  @Column({ name: 'history_diabetes', type: 'boolean', default: false })
  historyDiabetes: boolean;

  @Column({ name: 'history_stroke', type: 'boolean', default: false })
  historyStroke: boolean;

  @Column({ name: 'history_cancer', type: 'boolean', default: false })
  historyCancer: boolean;

  @Column({ name: 'history_heart_disease', type: 'boolean', default: false })
  historyHeartDisease: boolean;

  @Column({ name: 'history_covid', type: 'boolean', default: false })
  historyCovid: boolean;

  @Column({ name: 'history_asthma', type: 'boolean', default: false })
  historyAsthma: boolean;

  @Column({ name: 'history_obesity', type: 'boolean', default: false })
  historyObesity: boolean;

  @Column({ name: 'history_dyslipidemia', type: 'boolean', default: false })
  historyDyslipidemia: boolean;

  @Column({ name: 'history_allergies', type: 'boolean', default: false })
  historyAllergies: boolean;

  @Column({ name: 'history_smoking', type: 'boolean', default: false })
  historySmoking: boolean;

  @Column({ name: 'history_alcoholism', type: 'boolean', default: false })
  historyAlcoholism: boolean;

  @Column({ name: 'history_other', nullable: true })
  historyOther: string;

  // Surgeries (JSON column as there can be multiple)
  @Column({ type: 'json', nullable: true })
  surgeries: {
    procedure: string;
    date: string;
    hospital?: string;
    doctor?: string;
    observations?: string;
  }[];

  // Current Medications (JSON column as there can be multiple)
  @Column({ type: 'json', nullable: true })
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    observations?: string;
  }[];

  // Vaccination
  @Column({ name: 'vaccination_covid', type: 'boolean', default: false })
  vaccinationCovid: boolean;

  @Column({ name: 'vaccination_tetanus', type: 'boolean', default: false })
  vaccinationTetanus: boolean;

  @Column({ name: 'vaccination_hepatitis_b', type: 'boolean', default: false })
  vaccinationHepatitisB: boolean;

  // Family History
  @Column({ name: 'family_hypertension', type: 'boolean', default: false })
  familyHypertension: boolean;

  @Column({ name: 'family_diabetes', type: 'boolean', default: false })
  familyDiabetes: boolean;

  @Column({ name: 'family_asthma', type: 'boolean', default: false })
  familyAsthma: boolean;

  @Column({ name: 'family_cancer', type: 'boolean', default: false })
  familyCancer: boolean;

  @Column({ name: 'family_allergies', type: 'boolean', default: false })
  familyAllergies: boolean;

  @Column({ name: 'family_heart_disease', type: 'boolean', default: false })
  familyHeartDisease: boolean;

  @Column({ name: 'family_stroke', type: 'boolean', default: false })
  familyStroke: boolean;

  @Column({ name: 'family_smoking', type: 'boolean', default: false })
  familySmoking: boolean;

  @Column({ name: 'family_alcoholism', type: 'boolean', default: false })
  familyAlcoholism: boolean;

  @Column({ name: 'family_sedentary', type: 'boolean', default: false })
  familySedentary: boolean;

  @Column({ name: 'family_other', nullable: true })
  familyOther: string;

  // Habits and Customs
  @Column({ name: 'social_drinking', type: 'boolean', default: false })
  socialDrinking: boolean;

  @Column({ name: 'chronic_drinking', type: 'boolean', default: false })
  chronicDrinking: boolean;

  @Column({ name: 'smoking', type: 'boolean', default: false })
  smoking: boolean;

  @Column({ name: 'illicit_drug_use', type: 'boolean', default: false })
  illicitDrugUse: boolean;

  @Column({ name: 'habits_observations', nullable: true })
  habitsObservations: string;

  // Physical Examination (JSON columns for complex structures)
  @Column({ name: 'respiratory_system', type: 'json', nullable: true })
  respiratorySystem: {
    classification: number;
    respiratoryRate?: number;
    findings?: string[];
    observations?: string;
  };

  @Column({ name: 'cardiovascular_system', type: 'json', nullable: true })
  cardiovascularSystem: {
    classification: number;
    heartRate?: number;
    findings?: string[];
    observations?: string;
  };

  @Column({ name: 'abdomen', type: 'json', nullable: true })
  abdomen: {
    classification: number;
    findings?: string[];
    observations?: string;
  };

  @Column({ name: 'musculoskeletal_system', type: 'json', nullable: true })
  musculoskeletalSystem: {
    classification: number;
    findings?: string[];
    muscleStrength?: number;
    observations?: string;
  };

  @Column({ name: 'upper_limbs', type: 'json', nullable: true })
  upperLimbs: {
    classification: number;
    findings?: string[];
    observations?: string;
  };

  @Column({ name: 'lower_limbs', type: 'json', nullable: true })
  lowerLimbs: {
    classification: number;
    findings?: string[];
    observations?: string;
  };

  // Requested Exams
  @Column({ name: 'exam_cbc', type: 'boolean', default: false })
  examCBC: boolean;

  @Column({ name: 'exam_glucose', type: 'boolean', default: false })
  examGlucose: boolean;

  @Column({ name: 'exam_glycated_hemoglobin', type: 'boolean', default: false })
  examGlycatedHemoglobin: boolean;

  @Column({ name: 'exam_total_cholesterol', type: 'boolean', default: false })
  examTotalCholesterol: boolean;

  @Column({ name: 'exam_triglycerides', type: 'boolean', default: false })
  examTriglycerides: boolean;

  @Column({ name: 'exam_crp', type: 'boolean', default: false })
  examCRP: boolean;

  @Column({ name: 'exam_ast', type: 'boolean', default: false })
  examAST: boolean;

  @Column({ name: 'exam_alt', type: 'boolean', default: false })
  examALT: boolean;

  @Column({ name: 'exam_gamma_gt', type: 'boolean', default: false })
  examGammaGT: boolean;

  @Column({ name: 'exam_urea', type: 'boolean', default: false })
  examUrea: boolean;

  @Column({ name: 'exam_creatinine', type: 'boolean', default: false })
  examCreatinine: boolean;

  @Column({ name: 'exam_uric_acid', type: 'boolean', default: false })
  examUricAcid: boolean;

  @Column({ name: 'exam_psa', type: 'boolean', default: false })
  examPSA: boolean;

  @Column({ name: 'exam_urinalysis', type: 'boolean', default: false })
  examUrinalysis: boolean;

  @Column({ name: 'exam_stool_test', type: 'boolean', default: false })
  examStoolTest: boolean;

  @Column({ name: 'exam_echocardiogram', type: 'boolean', default: false })
  examEchocardiogram: boolean;

  @Column({ name: 'exam_stress_test', type: 'boolean', default: false })
  examStressTest: boolean;

  @Column({
    name: 'exam_abdominal_ultrasound',
    type: 'boolean',
    default: false,
  })
  examAbdominalUltrasound: boolean;

  @Column({ name: 'exam_chest_xray', type: 'boolean', default: false })
  examChestXray: boolean;

  @Column({ name: 'exam_mammography', type: 'boolean', default: false })
  examMammography: boolean;

  @Column({ name: 'exam_other', nullable: true })
  examOther: string;

  // Additional Observations
  @Column({ type: 'text', nullable: true })
  observations: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
