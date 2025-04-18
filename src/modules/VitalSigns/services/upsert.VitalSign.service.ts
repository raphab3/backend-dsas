import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { VitalSigns } from '../entities/VitalSigns.entity';
import { AttendanceStatusEnum } from '@modules/attendances/types';
import { UpsertVitalSignsDto } from '../dto/upsert-VitalSign.dto';

@Injectable()
export class UpsertVitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private vitalSignsRepository: Repository<VitalSigns>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
  ) {}

  async execute(upsertVitalSignsDto: UpsertVitalSignsDto) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: upsertVitalSignsDto.attendanceId },
      relations: ['patient', 'professional'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    if (attendance.status === AttendanceStatusEnum.COMPLETED) {
      throw new BadRequestException(
        'Cannot update vital signs of a completed attendance',
      );
    }

    const professional = await this.professionalRepository.findOne({
      where: { id: attendance.professional.id },
    });

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    const vitalSignsData = {
      temperature: upsertVitalSignsDto.temperature,
      systolicPressure: upsertVitalSignsDto.systolicPressure,
      diastolicPressure: upsertVitalSignsDto.diastolicPressure,
      heartRate: upsertVitalSignsDto.heartRate,
      respiratoryRate: upsertVitalSignsDto.respiratoryRate,
      oxygenSaturation: upsertVitalSignsDto.oxygenSaturation,
      weight: upsertVitalSignsDto.weight,
      height: upsertVitalSignsDto.height,
      bloodGlucose: upsertVitalSignsDto.bloodGlucose,
      metadata: upsertVitalSignsDto.metadata,
      attendance: { id: attendance.id },
      patient: { id: attendance.patient.id },
      registeredBy: { id: professional.id },
      measuredAt: new Date(),
    };

    const existingVitalSigns = await this.vitalSignsRepository.findOne({
      where: {
        attendance: { id: attendance.id },
      },
    });

    if (existingVitalSigns) {
      await this.vitalSignsRepository.update(
        existingVitalSigns.id,
        vitalSignsData,
      );

      return this.vitalSignsRepository.findOne({
        where: { id: existingVitalSigns.id },
        relations: ['attendance', 'patient', 'registeredBy'],
      });
    } else {
      const newVitalSigns = this.vitalSignsRepository.create(vitalSignsData);
      return this.vitalSignsRepository.save(newVitalSigns);
    }
  }
}
