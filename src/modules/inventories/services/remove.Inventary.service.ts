import { Injectable } from '@nestjs/common';
import InventaryRepository from '../typeorm/repositories/InventaryRepository';

@Injectable()
export class RemoveInventaryService {
  constructor(private readonly inventaryRepository: InventaryRepository) {}
  remove(id: string) {
    return this.inventaryRepository.delete(id);
  }
}
