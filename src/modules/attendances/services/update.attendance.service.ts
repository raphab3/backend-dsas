import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { UpdateAttendanceSpecialtyLocationDto } from '../dto/update-attendance-specialty-location.dto';

interface UpdateAttendanceEvolutionDto {
  content: string;
}

@Injectable()
export class UpdateAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async updateEvolution(
    id: string,
    data: UpdateAttendanceEvolutionDto,
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    const updatedAttendance = await this.attendanceRepository.save({
      ...attendance,
      evolution: data.content,
      evolutionUpdatedAt: new Date(),
    });

    return updatedAttendance;
  }

  async updateSpecialtyLocation(
    id: string,
    data: UpdateAttendanceSpecialtyLocationDto,
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['specialty', 'location'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    // Update specialty if provided
    if (data.specialtyId) {
      const specialty = await this.specialtyRepository.findOne({
        where: { id: data.specialtyId },
      });

      if (!specialty) {
        throw new NotFoundException('Specialty not found');
      }

      attendance.specialty = specialty;
    }

    // Update location if provided
    if (data.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: data.locationId },
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      attendance.location = location;
    }

    return this.attendanceRepository.save(attendance);
  }
}
