import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cid } from '../entities/cid.entity';
import { CreateCidDto } from '../dto/create-cid.dto';

@Injectable()
export class CreateCidService {
  private readonly logger = new Logger(CreateCidService.name);

  constructor(
    @InjectRepository(Cid)
    private cidRepository: Repository<Cid>,
  ) {}

  async execute(createCidDto: CreateCidDto): Promise<Cid> {
    this.logger.log(`Creating CID with code: ${createCidDto.code}`);

    // Check if CID with the same code already exists
    const existingCid = await this.cidRepository.findOne({
      where: { code: createCidDto.code },
    });

    if (existingCid) {
      this.logger.warn(`CID with code ${createCidDto.code} already exists`);
      throw new ConflictException(
        `CID with code ${createCidDto.code} already exists`,
      );
    }

    // Create and save the new CID
    const cid = this.cidRepository.create(createCidDto);
    return this.cidRepository.save(cid);
  }
}
