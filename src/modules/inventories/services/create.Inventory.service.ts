import { Injectable } from '@nestjs/common';
import InventaryRepository from '../typeorm/repositories/InventaryRepository';

@Injectable()
export class CreateInventoryService {
  constructor(private readonly inventaryRepository: InventaryRepository) {}

  async execute(createInventaryDto: any) {
    return await this.inventaryRepository.create(createInventaryDto);
  }
}
