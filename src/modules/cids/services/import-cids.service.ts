import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cid } from '../entities/cid.entity';
import * as path from 'path';
import csv from 'csv-parser';
import { createReadStream } from 'fs';

interface Chapter {
  numcap: string;
  catinic: string;
  catfim: string;
  descricao: string;
  descrabrev: string;
}

interface Group {
  catinic: string;
  catfim: string;
  descricao: string;
  descrabrev: string;
}

interface Subcategory {
  subcat: string;
  classif: string;
  restrsexo: string;
  causaobito: string;
  descricao: string;
  descrabrev: string;
  refer: string;
  excluidos: string;
}

@Injectable()
export class ImportCidsService {
  private readonly logger = new Logger(ImportCidsService.name);
  private readonly uploadsDir = path.join(
    process.cwd(),
    'src/modules/cids/uploads',
  );
  private groups: Group[] = [];
  private subcategories: Subcategory[] = [];

  constructor(
    @InjectRepository(Cid)
    private readonly cidRepository: Repository<Cid>,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Starting CID import...');

    const count = await this.cidRepository.count();
    if (count > 0) {
      this.logger.log(
        `CID table already has ${count} records. Do you want to continue and potentially duplicate records?`,
      );
      // In a real application, you might want to add a confirmation step here
    }

    try {
      // Load all reference data first
      await this.loadChapters();
      await this.loadGroups();
      await this.loadCategories();
      await this.loadSubcategories();

      // Process and save subcategories (most detailed level)
      await this.processAndSaveSubcategories();

      this.logger.log('CID import completed successfully');
    } catch (error) {
      this.logger.error('Error importing CIDs:', error);
      throw error;
    }
  }

  private async loadChapters(): Promise<void> {
    this.logger.log('Loading chapters...');
    return new Promise((resolve, reject) => {
      const results: Chapter[] = [];
      createReadStream(path.join(this.uploadsDir, 'CID-10-CAPITULOS.CSV'))
        .pipe(csv({ separator: ';' }))
        .on('data', (data: any) => {
          results.push({
            numcap: data.NUMCAP,
            catinic: data.CATINIC,
            catfim: data.CATFIM,
            descricao: this.normalizeText(data.DESCRICAO),
            descrabrev: this.normalizeText(data.DESCRABREV),
          });
        })
        .on('end', () => {
          this.logger.log(`Loaded ${results.length} chapters`);
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async loadGroups(): Promise<void> {
    this.logger.log('Loading groups...');
    return new Promise((resolve, reject) => {
      const results: Group[] = [];
      createReadStream(path.join(this.uploadsDir, 'CID-10-GRUPOS.CSV'))
        .pipe(csv({ separator: ';' }))
        .on('data', (data: any) => {
          results.push({
            catinic: data.CATINIC,
            catfim: data.CATFIM,
            descricao: this.normalizeText(data.DESCRICAO),
            descrabrev: this.normalizeText(data.DESCRABREV),
          });
        })
        .on('end', () => {
          this.groups = results;
          this.logger.log(`Loaded ${results.length} groups`);
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async loadCategories(): Promise<void> {
    this.logger.log('Loading categories...');
    return new Promise((resolve, reject) => {
      createReadStream(path.join(this.uploadsDir, 'CID-10-CATEGORIAS.CSV'))
        .pipe(csv({ separator: ';' }))
        .on('data', () => {
          // Just read the file to ensure it exists
        })
        .on('end', () => {
          this.logger.log('Categories file loaded');
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async loadSubcategories(): Promise<void> {
    this.logger.log('Loading subcategories...');
    return new Promise((resolve, reject) => {
      const results: Subcategory[] = [];
      createReadStream(path.join(this.uploadsDir, 'CID-10-SUBCATEGORIAS.CSV'))
        .pipe(csv({ separator: ';' }))
        .on('data', (data: any) => {
          results.push({
            subcat: data.SUBCAT,
            classif: data.CLASSIF,
            restrsexo: data.RESTRSEXO,
            causaobito: data.CAUSAOBITO,
            descricao: this.normalizeText(data.DESCRICAO),
            descrabrev: this.normalizeText(data.DESCRABREV),
            refer: data.REFER,
            excluidos: data.EXCLUIDOS,
          });
        })
        .on('end', () => {
          this.subcategories = results;
          this.logger.log(`Loaded ${results.length} subcategories`);
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async processAndSaveSubcategories(): Promise<void> {
    this.logger.log('Processing and saving subcategories...');

    const batchSize = 100;
    const batches = Math.ceil(this.subcategories.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, this.subcategories.length);
      const batch = this.subcategories.slice(start, end);

      const cidsToSave = batch.map((subcategory) => {
        // Format the code (e.g., A000 -> A00.0)
        const code = this.formatCidCode(subcategory.subcat);

        // Find the category for this subcategory
        const categoryCode = code.substring(0, 3);

        // Find the group for this category
        const group = this.findGroup(categoryCode);

        return this.cidRepository.create({
          code,
          description: subcategory.descricao,
          category: group ? `${group.catinic}-${group.catfim}` : null,
          subcategory: categoryCode,
          active: true,
        });
      });

      await this.cidRepository.save(cidsToSave);
      this.logger.log(
        `Saved batch ${i + 1}/${batches} (${start + 1}-${end} of ${this.subcategories.length})`,
      );
    }

    this.logger.log(`Saved ${this.subcategories.length} CIDs to the database`);
  }

  private formatCidCode(subcat: string): string {
    // Format: A000 -> A00.0, B123 -> B12.3
    if (subcat.length === 4) {
      return `${subcat.substring(0, 3)}.${subcat.substring(3)}`;
    }
    return subcat;
  }

  private findGroup(categoryCode: string): Group | undefined {
    return this.groups.find((group) => {
      // Check if the category code is within the group range
      return categoryCode >= group.catinic && categoryCode <= group.catfim;
    });
  }

  private normalizeText(text: string): string {
    if (!text) return '';

    // Replace common special characters in Latin-1 encoding
    return text
      .replace(/�/g, 'á')
      .replace(/�/g, 'à')
      .replace(/�/g, 'â')
      .replace(/�/g, 'ã')
      .replace(/�/g, 'é')
      .replace(/�/g, 'ê')
      .replace(/�/g, 'í')
      .replace(/�/g, 'ó')
      .replace(/�/g, 'ô')
      .replace(/�/g, 'õ')
      .replace(/�/g, 'ú')
      .replace(/�/g, 'ü')
      .replace(/�/g, 'ç')
      .replace(/�/g, 'Á')
      .replace(/�/g, 'É')
      .replace(/�/g, 'Í')
      .replace(/�/g, 'Ó')
      .replace(/�/g, 'Ú')
      .replace(/�/g, 'Ç');
  }
}
