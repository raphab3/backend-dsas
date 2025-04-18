import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as crypto from 'crypto';

@Entity('form_share_tokens')
export class FormShareToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ unique: true })
  shortCode: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  formResponseId: string;

  @ManyToOne(() => Attendance, { nullable: true })
  @JoinColumn()
  attendance: Attendance;

  @Column({ nullable: true })
  attendanceId: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateToken() {
    // Gerar um token seguro usando crypto
    this.token = crypto.randomBytes(16).toString('hex');

    // Gerar um código curto para a URL
    this.shortCode = this.generateShortCode();
  }

  private generateShortCode(): string {
    // Caracteres que são fáceis de ler e digitar (sem caracteres ambíguos como 0/O, 1/l, etc.)
    const characters =
      '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
