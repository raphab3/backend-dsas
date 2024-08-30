import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { UpdateProfessionalDto } from '../dto/update-professional.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { Professional } from '../typeorm/entities/professional.entity';

@Injectable()
export class UpdateProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    const professional = await this.professionalRepository.findOne({
      where: { id },
      relations: ['specialties', 'locations', 'person_sig'],
    });

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    // Atualizar dados básicos
    professional.council = updateProfessionalDto.council;

    // Atualizar especialidades
    if (updateProfessionalDto.specialties) {
      const specialtyIds = updateProfessionalDto.specialties.map(
        (specialty) => specialty.id,
      );
      const specialties = await this.specialtyRepository.findBy({
        id: In(specialtyIds),
      });

      if (specialties.length !== specialtyIds.length) {
        throw new HttpException(
          'Um ou mais IDs de especialidades são inválidos',
          400,
        );
      }

      professional.specialties = specialties;
    }

    // Atualizar locais
    if (updateProfessionalDto.locations) {
      const locationIds = updateProfessionalDto.locations.map(
        (location) => location.id,
      );
      const locations = await this.locationRepository.findBy({
        id: In(locationIds),
      });

      if (locations.length !== locationIds.length) {
        throw new HttpException('Um ou mais IDs de locais são inválidos', 400);
      }

      professional.locations = locations;
    }

    // Salvar todas as alterações
    return this.professionalRepository.save(professional);
  }
}
