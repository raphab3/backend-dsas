import { Injectable } from '@nestjs/common';
import InventaryRepository from '../typeorm/repositories/InventaryRepository';

@Injectable()
export class FindOneInventoryService {
  constructor(private readonly inventaryRepository: InventaryRepository) {}
  async findOne(id: string): Promise<any> {
    return this.inventaryRepository.findOne(id);
  }
}
