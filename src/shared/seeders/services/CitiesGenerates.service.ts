import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '@modules/locations/typeorm/entities/city.entity';
import axios from 'axios';

interface IRequest {
  uf: string;
}

@Injectable()
export class CitiesGeneratesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async execute({ uf }: IRequest): Promise<void> {
    const cities = axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf
        .toUpperCase()
        .trim()}/municipios`,
    );

    const citiesData = (await cities).data;

    Promise.all(
      citiesData.map(async (city: any) => {
        const cityExists = await this.cityRepository.findOne({
          where: { name: city.nome.upperCase().trim() },
        });

        if (!cityExists) {
          const citySaved = this.cityRepository.create({
            name: city.nome.upperCase().trim(),
            uf: uf.toUpperCase().trim(),
          });

          await this.cityRepository.save(citySaved);
        }
      }),
    );

    console.log('Finished cities generation');
  }
}
