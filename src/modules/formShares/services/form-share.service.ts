import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormShareToken } from '../entities/formShareToken.entity';
import { CreateFormShareDto } from '../dto/create-form-share.dto';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FormShareService {
  constructor(
    @InjectRepository(FormShareToken)
    private formShareTokenRepository: Repository<FormShareToken>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private configService: ConfigService,
  ) {}

  /**
   * Cria um novo token de compartilhamento de formulário
   */
  async createFormShare(
    createFormShareDto: CreateFormShareDto,
  ): Promise<FormShareToken> {
    const {
      patientId,
      formResponseId,
      attendanceId,
      expirationDays = 7,
    } = createFormShareDto;

    // Verificar se o paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente com ID ${patientId} não encontrado`,
      );
    }

    // Verificar o atendimento, se fornecido
    if (attendanceId) {
      const attendance = await this.attendanceRepository.findOne({
        where: { id: attendanceId },
        relations: ['patient'],
      });

      if (!attendance) {
        throw new NotFoundException(
          `Atendimento com ID ${attendanceId} não encontrado`,
        );
      }

      // Verificar se o atendimento pertence ao paciente
      if (attendance.patient && attendance.patient.id !== patientId) {
        throw new BadRequestException(
          'O atendimento não pertence ao paciente informado',
        );
      }
    }

    // Criar o token
    const formShareToken = this.formShareTokenRepository.create({
      patientId,
      formResponseId,
      attendanceId,
      expiresAt: addDays(new Date(), expirationDays),
    });

    // Salvar e retornar
    await this.formShareTokenRepository.save(formShareToken);

    return formShareToken;
  }

  /**
   * Obtém um token pelo código curto
   */
  async getByShortCode(shortCode: string): Promise<FormShareToken> {
    const token = await this.formShareTokenRepository.findOne({
      where: { shortCode },
      relations: ['patient', 'attendance'],
    });

    if (!token) {
      throw new NotFoundException(
        'Link de formulário não encontrado ou expirado',
      );
    }

    // Verificar se o token expirou
    if (new Date() > token.expiresAt) {
      throw new BadRequestException('Este link de formulário expirou');
    }

    // Verificar se o token já foi usado
    if (token.used) {
      throw new BadRequestException('Este formulário já foi preenchido');
    }

    return token;
  }

  /**
   * Marca um token como usado e associa a resposta do formulário
   */
  async markAsUsed(tokenId: string, formResponseId: string): Promise<void> {
    const token = await this.formShareTokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new NotFoundException('Token não encontrado');
    }

    token.used = true;
    token.formResponseId = formResponseId;
    await this.formShareTokenRepository.save(token);
  }

  /**
   * Gera a URL completa para o formulário
   */
  getFormUrl(shortCode: string): string {
    const baseUrl = this.configService.get<string>(
      'PUBLIC_FORM_URL',
      'http://localhost:3000',
    );
    return `${baseUrl}/forms/public/${shortCode}`;
  }
}
