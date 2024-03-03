import {
  ICreateLocation,
  LocationCityEnum,
} from '@modules/locations/interfaces/ILocation';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationSeedService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async execute(): Promise<void> {
    const locations: ICreateLocation[] = [
      {
        name: 'Ambulatório Médico Central',
        description: 'Sediado na DSAS',
        city: LocationCityEnum.JOAO_PESSOA,
      },
      {
        name: 'NÚCLEO SETORIAL DE SAUDE (NSS)',
        description: 'Sediado no CE',
        city: LocationCityEnum.JOAO_PESSOA,
      },
      {
        name: 'NÚCLEO SETORIAL DE SAUDE (NSS)',
        description: 'Sediado no 2⁰ BPM',
        city: LocationCityEnum.CAMPINA_GRANDE,
      },
      {
        name: 'NÚCLEO SETORIAL DE SAUDE (NSS)',
        city: LocationCityEnum.PATOS,
        description: 'Sediado no 3⁰ BPM',
      },
      {
        name: 'NÚCLEO SETORIAL DE SAUDE (NSS)',
        city: LocationCityEnum.SOUSA,
        description: 'Sediado no 14⁰ BPM',
      },
      {
        name: 'NÚCLEO SETORIAL DE SAUDE (NSS)',
        city: LocationCityEnum.GUARABIRA,
        description: 'Sediado no 4⁰ BPM',
      },
      {
        name: 'ESPACO VIVER BEM (EVB)',
        city: LocationCityEnum.JOAO_PESSOA,
      },
      {
        name: 'ESPACO VIVER BEM (EVB)',
        city: LocationCityEnum.CAMPINA_GRANDE,
      },
      {
        name: 'ESPACO VIVER BEM (EVB)',
        city: LocationCityEnum.PATOS,
      },
      {
        name: 'NÚCLEO DE FISIOTERAPIA (NFISIO)',
        city: LocationCityEnum.PATOS,
      },
      {
        name: 'NÚCLEO DE FISIOTERAPIA (NFISIO)',
        city: LocationCityEnum.JOAO_PESSOA,
      },
      {
        name: 'NÚCLEO DE FISIOTERAPIA (NFISIO)',
        city: LocationCityEnum.CAMPINA_GRANDE,
      },
      {
        name: 'NÚCLEO DE FISIOTERAPIA (NFISIO)',
        city: LocationCityEnum.GUARABIRA,
      },
    ];

    for (const locationData of locations) {
      locationData.name = locationData.name.toUpperCase();
      locationData.description = locationData.description?.toUpperCase();
      const location = this.locationRepository.create(locationData);
      try {
        await this.locationRepository.save(location);
      } catch (error) {
        console.error('Erro ao inserir dados de Localização', error);
      }
    }

    console.log('Dados de Localização inseridos');
  }
}
