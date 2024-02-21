import { Injectable } from '@nestjs/common';
import InventaryRepository from '../typeorm/repositories/InventaryRepository';

@Injectable()
export class FindAllInventaryService {
  constructor(private readonly inventaryRepository: InventaryRepository) {}

  async findAll(query: any): Promise<any> {
    return this.inventaryRepository.list(query);
  }
}
