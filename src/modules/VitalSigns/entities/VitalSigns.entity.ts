import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vital_signs')
export class VitalSigns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: 'integer', nullable: true })
  systolicPressure: number;

  @Column({ type: 'integer', nullable: true })
  diastolicPressure: number;

  @Column({ type: 'integer', nullable: true })
  heartRate: number;

  @Column({ type: 'integer', nullable: true })
  respiratoryRate: number;

  @Column({ type: 'integer', nullable: true })
  oxygenSaturation: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  bloodGlucose: number;

  @Column({ type: 'jsonb' })
  metadata: {
    measurementConditions?: string;
    equipmentUsed?: string;
    notes?: string;
    position?: 'SITTING' | 'STANDING' | 'LYING';
    [key: string]: any;
  };

  @ManyToOne(() => Patient, (patient) => patient.vitalSings)
  patient: Patient;

  @OneToOne(() => Attendance, (attendance) => attendance.vitalSigns)
  @JoinColumn()
  attendance: Attendance;

  @ManyToOne(() => Professional, (professional) => professional.vitalSings)
  @JoinColumn()
  registeredBy: Professional;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz' })
  measuredAt: Date;
}
