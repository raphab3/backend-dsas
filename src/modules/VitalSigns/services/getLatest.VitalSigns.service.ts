import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSigns } from '../entities/VitalSigns.entity';

@Injectable()
export class GetLatestVitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private vitalSignsRepository: Repository<VitalSigns>,
  ) {}

  /**
   * Get the latest vital signs for a patient
   * @param patientId The patient ID
   * @returns The latest vital signs or null if none found
   */
  async getLatestByPatient(patientId: string): Promise<VitalSigns | null> {
    console.log('Getting latest vital signs for patient:', patientId);

    const result = await this.vitalSignsRepository.findOne({
      where: { patient: { id: patientId } },
      relations: ['patient', 'registeredBy', 'attendance'],
      order: { createdAt: 'DESC' },
    });

    console.log('Latest vital signs result:', result ? 'Found' : 'Not found');
    return result;
  }

  /**
   * Get vital signs for a specific attendance
   * @param attendanceId The attendance ID
   * @returns The vital signs for the attendance or null if none found
   */
  async getByAttendance(attendanceId: string): Promise<VitalSigns | null> {
    console.log('Getting vital signs for attendance:', attendanceId);

    const result = await this.vitalSignsRepository.findOne({
      where: { attendance: { id: attendanceId } },
      relations: ['patient', 'registeredBy', 'attendance'],
    });

    console.log(
      'Attendance vital signs result:',
      result ? 'Found' : 'Not found',
    );
    return result;
  }

  /**
   * Get the latest vital signs for a patient, optionally from a specific attendance
   * @param patientId The patient ID
   * @param attendanceId Optional attendance ID
   * @returns The vital signs or null if none found
   */
  async execute(
    patientId: string,
    attendanceId?: string,
  ): Promise<VitalSigns | null> {
    console.log(
      'Execute with patientId:',
      patientId,
      'attendanceId:',
      attendanceId,
    );

    // If attendanceId is provided, try to get vital signs for that attendance first
    if (attendanceId) {
      const attendanceResult = await this.getByAttendance(attendanceId);
      if (attendanceResult) {
        return attendanceResult;
      }

      console.log(
        'No vital signs found for attendance. Falling back to latest patient vital signs.',
      );
    }

    // If no attendance vital signs found or no attendanceId provided,
    // get the latest vital signs for the patient
    return this.getLatestByPatient(patientId);
  }
}
