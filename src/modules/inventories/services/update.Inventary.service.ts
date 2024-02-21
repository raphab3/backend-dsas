import { Injectable } from '@nestjs/common';
import { UpdateInventaryDto } from '../dto/UpdateInventaryDto';
import InventaryRepository from '../typeorm/repositories/InventaryRepository';

@Injectable()
export class UpdateInventaryService {
  constructor(private readonly inventaryRepository: InventaryRepository) {}
  update(id: string, updateInventaryDto: UpdateInventaryDto) {
    return this.inventaryRepository.update(id, updateInventaryDto);
  }
}
