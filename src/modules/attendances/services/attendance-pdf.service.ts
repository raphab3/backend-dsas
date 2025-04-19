import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import * as puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PatientHealthInfoService } from '@modules/patientHealth/services/patient-health-info.service';
import * as fs from 'fs';
import * as path from 'path';
import { AttendanceStatusEnum } from '../types';
import env from '@config/env';

@Injectable()
export class AttendancePdfService {
  private readonly logger = new Logger(AttendancePdfService.name);
  private logoBase64: string;

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private s3Provider: S3Provider,
    private patientHealthInfoService: PatientHealthInfoService,
  ) {
    // Carregar o logo na inicialização do serviço
    this.loadLogo();
  }

  /**
   * Carrega o logo do sistema de arquivos e converte para base64
   */
  private loadLogo(): void {
    try {
      // Caminho relativo ao diretório raiz do projeto
      const logoPath = path.join(
        process.cwd(),
        'public',
        'imagens',
        'logo-sigsaude.png',
      );

      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        this.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        this.logger.log('Logo carregado com sucesso');
      } else {
        this.logger.warn(`Logo não encontrado em ${logoPath}`);
        // Definir um valor padrão para evitar erros
        this.logoBase64 = '';
      }
    } catch (error) {
      this.logger.error(`Erro ao carregar logo: ${error.message}`);
      this.logoBase64 = '';
    }
  }

  /**
   * Generates a PDF for an attendance
   * @param attendanceId The ID of the attendance
   * @param options Options for PDF generation
   * @returns The S3 key of the generated PDF
   */
  async generatePdf(
    attendanceId: string,
    options: {
      includeEvolution?: boolean;
      userId: string;
    },
  ): Promise<{ s3Key: string; pdfBuffer: Buffer; verificationCode: string }> {
    try {
      // Find the attendance with all necessary relations
      const attendance = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.professional', 'professional')
        .leftJoinAndSelect('professional.person_sig', 'person_sig_profesional')
        .leftJoinAndSelect('attendance.patient', 'patient')
        .leftJoinAndSelect('patient.dependent', 'dependent')
        .leftJoinAndSelect('patient.person_sig', 'person_sig')
        .leftJoinAndSelect('attendance.vitalSigns', 'vitalSigns')
        .leftJoinAndSelect('attendance.appointment', 'appointment')
        .leftJoinAndSelect('appointment.schedule', 'schedule')
        .leftJoinAndSelect('schedule.specialty', 'schedule_specialty')
        .leftJoinAndSelect('schedule.location', 'location')
        .leftJoinAndSelect('attendance.specialty', 'specialty')
        .leftJoinAndSelect('attendance.location', 'attendance_location')
        .leftJoinAndSelect(
          'attendance.attendanceAttachments',
          'attendanceAttachments',
        )
        .leftJoinAndSelect('attendanceAttachments.attachment', 'attachment')
        .leftJoinAndSelect('attendanceAttachments.uploadedBy', 'uploadedBy')
        .where('attendance.id = :id', { id: attendanceId })
        .getOne();

      if (!attendance) {
        throw new HttpException('Atendimento não encontrado', 404);
      }

      // Get patient health info
      const patientHealthInfo =
        await this.patientHealthInfoService.getPatientHealthInfo(
          attendance.patient.id,
        );

      // Generate HTML content for the PDF and get verification code
      const { htmlContent, verificationCode } = await this.generateHtmlContent(
        attendance,
        patientHealthInfo,
        options,
      );

      // Generate PDF using Puppeteer
      const pdfBuffer = await this.generatePdfFromHtml(htmlContent);

      this.logger.debug(
        `Generated PDF buffer: type=${typeof pdfBuffer}, isBuffer=${Buffer.isBuffer(pdfBuffer)}, length=${pdfBuffer.length}`,
      );

      // Save PDF to S3
      const s3Key = `attendances/${attendance.id}/pdf/${Date.now()}.pdf`;
      await this.s3Provider.uploadContent(pdfBuffer, s3Key, {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
        metadata: {
          attendanceId: attendance.id,
          userId: options.userId,
          generatedAt: new Date().toISOString(),
        },
      });

      return { s3Key, pdfBuffer, verificationCode };
    } catch (error) {
      this.logger.error(`Error generating PDF: ${error.message}`, error.stack);
      throw new HttpException(`Error generating PDF: ${error.message}`, 500);
    }
  }

  /**
   * Generates HTML content for the PDF
   */
  private async generateHtmlContent(
    attendance: Attendance,
    patientHealthInfo: any,
    options: { includeEvolution?: boolean },
  ): Promise<{ htmlContent: string; verificationCode: string }> {
    const verificationId = `SIG-${attendance.id.substring(0, 8)}-${Date.now().toString(36).toUpperCase()}`;
    const formatDate = (date: Date | string) => {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          this.logger.warn(`Data inválida: ${date}`);
          return '';
        }
        return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
      } catch (error) {
        this.logger.warn(`Erro ao formatar data: ${date} - ${error.message}`);
        return '';
      }
    };

    const formatDateTime = (date: Date | string) => {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          this.logger.warn(`Data/hora inválida: ${date}`);
          return '';
        }
        return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      } catch (error) {
        this.logger.warn(
          `Erro ao formatar data/hora: ${date} - ${error.message}`,
        );
        return '';
      }
    };

    const calculateAge = (birthDate: Date | string) => {
      if (!birthDate) return '';
      try {
        const today = new Date();
        const birth = new Date(birthDate);

        if (isNaN(birth.getTime())) {
          this.logger.warn(`Data de nascimento inválida: ${birthDate}`);
          return '';
        }

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
          age--;
        }
        return age;
      } catch (error) {
        this.logger.warn(
          `Erro ao calcular idade: ${birthDate} - ${error.message}`,
        );
        return '';
      }
    };

    // Format vital signs
    const vitalSigns = attendance.vitalSigns
      ? {
          temperature: attendance.vitalSigns.temperature
            ? `${attendance.vitalSigns.temperature} °C`
            : '-',
          bloodPressure:
            attendance.vitalSigns.systolicPressure &&
            attendance.vitalSigns.diastolicPressure
              ? `${attendance.vitalSigns.systolicPressure}/${attendance.vitalSigns.diastolicPressure} mmHg`
              : '-',
          heartRate: attendance.vitalSigns.heartRate
            ? `${attendance.vitalSigns.heartRate} bpm`
            : '-',
          respiratoryRate: attendance.vitalSigns.respiratoryRate
            ? `${attendance.vitalSigns.respiratoryRate} rpm`
            : '-',
          oxygenSaturation: attendance.vitalSigns.oxygenSaturation
            ? `${attendance.vitalSigns.oxygenSaturation}%`
            : '-',
          weight: attendance.vitalSigns.weight
            ? `${attendance.vitalSigns.weight} kg`
            : '-',
          height: attendance.vitalSigns.height
            ? `${attendance.vitalSigns.height} cm`
            : '-',
          bmi:
            attendance.vitalSigns.weight && attendance.vitalSigns.height
              ? `${(Number(attendance.vitalSigns.weight) / Math.pow(Number(attendance.vitalSigns.height) / 100, 2)).toFixed(2)} kg/m²`
              : '-',
          bloodGlucose: attendance.vitalSigns.bloodGlucose
            ? `${attendance.vitalSigns.bloodGlucose} mg/dL`
            : '-',
        }
      : null;

    // Format allergies
    const allergies = patientHealthInfo?.allergies || [];
    const chronicConditions = patientHealthInfo?.chronicConditions || [];

    // Generate HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Atendimento ${attendance.code}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
          }
          .header-logo {
            width: 120px;
            height: auto;
          }
          .header-content {
            text-align: center;
            flex-grow: 1;
          }
          .header h1 {
            margin: 0;
            font-size: 18px;
          }
          .header p {
            margin: 5px 0;
          }
          .verification-id {
            font-family: monospace;
            font-weight: bold;
            font-size: 10px;
            text-align: right;
            margin-top: 5px;
            color: #333;
          }
          .section {
            margin-bottom: 10px;
            border: 1px solid #eee;
            padding: 5px;
            border-radius: 5px;
          }
          .section h2 {
            margin-top: 0;
            font-size: 12px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
            flex-shrink: 0;
          }
          .info-value {
            flex-grow: 1;
          }
          .vital-signs-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .vital-sign-item {
            border: 1px solid #eee;
            padding: 5px;
            border-radius: 3px;
          }
          .vital-sign-label {
            font-weight: bold;
            font-size: 10px;
            color: #666;
          }
          .vital-sign-value {
            font-size: 12px;
          }
          .health-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .health-info-item {
            border: 1px solid #eee;
            padding: 8px;
            border-radius: 3px;
          }
          .evolution-content {
            white-space: pre-wrap;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 3px;
            min-height: 100px;
          }
          .signature-area {
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            position: relative;
          }
          .signature-line {
            margin: 0 auto;
            width: 250px;
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
          }
          .signature-stamp {
            position: absolute;
            top: -40px;
            right: 50px;
            width: 120px;
            height: 120px;
            border: 2px solid #0066cc;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            color: #0066cc;
            transform: rotate(-15deg);
            opacity: 0.8;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${this.logoBase64}" alt="SigSaúde Logo" class="header-logo">
          <div class="header-content">
            <h1>REGISTRO DE ATENDIMENTO</h1>
            <p>SigSaúde - Sistema de Gestão em Saúde</p>
            <p>Código: ${attendance.code}</p>
            <div class="verification-id">ID de Verificação: ${verificationId}</div>
          </div>
        </div>

        <div class="section">
          <h2>Informações do Atendimento</h2>
          <div class="info-row">
            <div class="info-label">Data/Hora:</div>
            <div class="info-value">${formatDateTime(attendance.startAttendance)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Profissional:</div>
            <div class="info-value">${
              attendance.professional?.person_sig?.nome || 'Não informado'
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Especialidade:</div>
            <div class="info-value">${
              attendance.specialty?.name || 'Não informada'
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Local:</div>
            <div class="info-value">${
              attendance.location?.name || 'Não informado'
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Status:</div>
            <div class="info-value">${this.translateStatus(attendance.status)}</div>
          </div>
        </div>

        <div class="section">
          <h2>Informações do Paciente</h2>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${
              attendance.patient?.dependent
                ? attendance.patient?.dependent?.name
                : attendance.patient?.person_sig?.nome || ''
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">CPF:</div>
            <div class="info-value">${
              attendance.patient?.dependent
                ? attendance.patient?.dependent?.cpf
                : attendance.patient?.person_sig?.cpf || ''
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Data de Nascimento:</div>
            <div class="info-value">${
              attendance.patient?.dependent
                ? formatDate(attendance.patient?.dependent?.birth_date)
                : formatDate(attendance.patient?.person_sig?.data_nascimento)
            } (${
              attendance.patient?.dependent
                ? calculateAge(attendance.patient?.dependent?.birth_date)
                : calculateAge(attendance.patient?.person_sig?.data_nascimento)
            } anos)</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gênero:</div>
            <div class="info-value">${
              attendance.patient?.dependent
                ? this.translateSex(attendance.patient?.dependent?.gender)
                : this.translateSex(attendance.patient?.person_sig?.sexo)
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Telefone:</div>
            <div class="info-value">${
              attendance.patient?.dependent
                ? attendance.patient?.dependent?.phone
                : attendance.patient?.person_sig?.telefone || ''
            }</div>
          </div>
          ${
            attendance.patient?.dependent
              ? `
          <div class="info-row">
            <div class="info-label">Grau de Parentesco:</div>
            <div class="info-value">${
              this.trasnlateDegreeOfKinship(
                attendance.patient?.dependent?.degree_of_kinship,
              ) || ''
            }</div>
          </div>
          <div class="info-row">
            <div class="info-label">Titular:</div>
            <div class="info-value">${attendance.patient?.person_sig?.nome || ''}</div>
          </div>
          `
              : ''
          }
        </div>

        ${
          vitalSigns
            ? `
        <div class="section">
          <h2>Sinais Vitais</h2>
          <div class="vital-signs-grid">
            <div class="vital-sign-item">
              <div class="vital-sign-label">Temperatura</div>
              <div class="vital-sign-value">${vitalSigns.temperature}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Pressão Arterial</div>
              <div class="vital-sign-value">${vitalSigns.bloodPressure}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Frequência Cardíaca</div>
              <div class="vital-sign-value">${vitalSigns.heartRate}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Frequência Respiratória</div>
              <div class="vital-sign-value">${vitalSigns.respiratoryRate}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Saturação de Oxigênio</div>
              <div class="vital-sign-value">${vitalSigns.oxygenSaturation}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Peso</div>
              <div class="vital-sign-value">${vitalSigns.weight}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Altura</div>
              <div class="vital-sign-value">${vitalSigns.height}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">IMC</div>
              <div class="vital-sign-value">${vitalSigns.bmi}</div>
            </div>
            <div class="vital-sign-item">
              <div class="vital-sign-label">Glicemia</div>
              <div class="vital-sign-value">${vitalSigns.bloodGlucose}</div>
            </div>
          </div>
        </div>
        `
            : ''
        }

        ${
          allergies.length > 0 || chronicConditions.length > 0
            ? `
        <div class="section">
          <h2>Informações de Saúde</h2>
          <div class="health-info-grid">
            ${
              allergies.length > 0
                ? `
            <div class="health-info-item">
              <h3>Alergias</h3>
              <ul>
                ${allergies
                  .map(
                    (allergy) => `
                <li>
                  <strong>${allergy.allergen}</strong> -
                  Severidade: ${
                    this.translateSeverity(allergy.severity) || 'Não informada'
                  },
                  Reação: ${allergy.reaction || 'Não informada'}
                </li>
                `,
                  )
                  .join('')}
              </ul>
            </div>
            `
                : ''
            }

            ${
              chronicConditions.length > 0
                ? `
            <div class="health-info-item">
              <h3>Condições Crônicas</h3>
              <ul>
                ${chronicConditions
                  .map(
                    (condition) => `
                <li>
                  <strong>${condition.condition}</strong> -
                  Status: ${
                    this.translateConditionStatus(condition.status) ||
                    'Não informado'
                  },
                  Desde: ${formatDate(condition.diagnosedAt) || 'Não informado'}
                </li>
                `,
                  )
                  .join('')}
              </ul>
            </div>
            `
                : ''
            }
          </div>
        </div>
        `
            : ''
        }

        ${
          options.includeEvolution && attendance.evolution
            ? `
        <div class="section">
          <h2>Evolução</h2>
          <div class="evolution-content">
            ${attendance.evolution}
          </div>
        </div>
        `
            : ''
        }

        <div class="signature-area">
          <div class="signature-stamp">
            <div>DOCUMENTO</div>
            <div>ASSINADO</div>
            <div>DIGITALMENTE</div>
            <div style="font-size: 8px; margin-top: 5px;">Verificar em:</div>
            <div style="font-size: 8px;">${env.BACKOFFICE_URL}/verificar?code=${verificationId}</div>
          </div>
          <div class="signature-line"></div>
          <p>${attendance.professional?.person_sig?.nome || 'Profissional'}<br>
          ${
            attendance.professional?.specialties?.[0]?.name
              ? attendance.professional.specialties?.[0]?.name
              : attendance.specialty?.name || 'Especialidade'
          }</p>
        </div>

        <div class="footer">
          <p>Documento gerado em ${formatDateTime(new Date())}</p>
          <p>SigSaúde - Sistema de Gestão em Saúde</p>
          <p>ID de Verificação: ${verificationId}</p>
          <p>Para verificar a autenticidade deste documento, acesse: ${env.BACKOFFICE_URL}/verificar?code=${verificationId}</p>
        </div>
      </body>
      </html>
    `;

    return { htmlContent, verificationCode: verificationId };
  }

  /**
   * Generates a PDF from HTML content using Puppeteer
   */
  private async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      return pdfBuffer as Buffer;
    } finally {
      await browser.close();
    }
  }

  /**
   * Gets a signed URL for an attendance PDF
   */
  async getSignedUrl(s3Key: string): Promise<string> {
    return this.s3Provider.getSignedUrl(s3Key, 3600); // 1 hour expiration
  }

  translateStatus(status: AttendanceStatusEnum): string {
    switch (status) {
      case AttendanceStatusEnum.IN_PROGRESS:
        return 'Em Andamento';
      case AttendanceStatusEnum.COMPLETED:
        return 'Finalizado';
      case AttendanceStatusEnum.CANCELED:
        return 'Cancelado';
      case AttendanceStatusEnum.PAUSED:
        return 'Pausado';
      default:
        return 'Desconhecido';
    }
  }

  translateSex(sex: string): string {
    switch (sex) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Feminino';
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Feminino';
      default:
        return 'Desconhecido';
    }
  }

  trasnlateDegreeOfKinship(degree: string): string {
    switch (degree) {
      case 'son':
        return 'Filho(a)';
      case 'daughter':
        return 'Esposo(a)';
      case 'father':
        return 'Pai';
      case 'mother':
        return 'Mãe';
      case 'grandparent':
        return 'Avô(ó)';
      case 'grandchild':
        return 'Neto(a)';
      default:
        return 'Desconhecido';
    }
  }

  translateSeverity(severity: string): string {
    switch (severity) {
      case 'MILD':
        return 'Leve';
      case 'MODERATE':
        return 'Moderada';
      case 'SEVERE':
        return 'Grave';
      case 'UNKNOWN':
        return 'Desconhecida';
      default:
        return 'Desconhecida';
    }
  }

  translateConditionStatus(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa';
      case 'RESOLVED':
        return 'Resolvida';
      case 'INACTIVE':
        return 'Inativa';
      case 'RECURRENT':
        return 'Recurrente';
      case 'UNKNOWN':
        return 'Desconhecido';
      default:
        return 'Desconhecido';
    }
  }
}
