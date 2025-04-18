import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cid } from '../entities/cid.entity';

@Injectable()
export class FindOneCidService {
  private readonly logger = new Logger(FindOneCidService.name);

  constructor(
    @InjectRepository(Cid)
    private cidRepository: Repository<Cid>,
  ) {}

  async execute(id: string): Promise<Cid> {
    this.logger.log(`Finding CID with id: ${id}`);

    const cid = await this.cidRepository.findOne({
      where: { id },
    });

    if (!cid) {
      this.logger.warn(`CID with id ${id} not found`);
      throw new NotFoundException(`CID with id ${id} not found`);
    }

    return cid;
  }

  async findByCode(code: string): Promise<Cid> {
    this.logger.log(`Finding CID with code: ${code}`);

    const cid = await this.cidRepository.findOne({
      where: { code },
    });

    if (!cid) {
      this.logger.warn(`CID with code ${code} not found`);
      throw new NotFoundException(`CID with code ${code} not found`);
    }

    return cid;
  }
}
