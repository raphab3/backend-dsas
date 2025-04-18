import { StatusAppointmentEnum } from '@modules/appointments/interfaces/IAppointment';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateStatusAttendanceDto } from '../dto/updateStatus-attendance.dto';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceStatusEnum } from '../types';
import { AttendanceProcessorService } from './attendance-processor.service';

@Injectable()
export class UpdateStatusAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private attendanceProcessor: AttendanceProcessorService,
  ) {}

  async execute(attendanceId: string, { status }: UpdateStatusAttendanceDto) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: ['appointment', 'patient', 'professional'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    this.validateStatusTransition(attendance.status, status);

    if (status === AttendanceStatusEnum.COMPLETED) {
      await this.completeAttendance(attendance);
    }

    attendance.status = status;
    return this.attendanceRepository.save(attendance);
  }

  private async completeAttendance(attendance: Attendance): Promise<void> {
    attendance.endAttendance = new Date();

    if (attendance.appointment) {
      await this.appointmentRepository.update(attendance.appointment.id, {
        status: StatusAppointmentEnum.ATTENDED,
      });
    }

    // Only process attendance if there are form responses
    if (attendance.formResponseIds?.length) {
      await this.attendanceProcessor.processAttendance(attendance);
    }
  }

  private validateStatusTransition(
    currentStatus: AttendanceStatusEnum,
    newStatus: AttendanceStatusEnum,
  ) {
    const validTransitions = {
      [AttendanceStatusEnum.IN_PROGRESS]: [
        AttendanceStatusEnum.PAUSED,
        AttendanceStatusEnum.COMPLETED,
        AttendanceStatusEnum.CANCELED,
      ],
      [AttendanceStatusEnum.PAUSED]: [
        AttendanceStatusEnum.IN_PROGRESS,
        AttendanceStatusEnum.COMPLETED,
      ],
      [AttendanceStatusEnum.COMPLETED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
