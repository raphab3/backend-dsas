import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { ExamAttachment } from '../entities/exam-attachment.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

@Injectable()
export class ExamAttachmentService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamAttachment)
    private examAttachmentRepository: Repository<ExamAttachment>,
    private storageProvider: S3Provider,
  ) {}

  async uploadAttachment(
    examId: string,
    file: Express.Multer.File,
    personSigId?: string,
  ): Promise<ExamAttachment> {
    // Find exam
    const exam = await this.examRepository.findOne({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    // Create path for file
    const fileKey = `exams/${examId}/${file.originalname}`;

    // Save file to storage
    await this.storageProvider.uploadContent(
      file.buffer || Buffer.from(file.path, 'utf-8'),
      fileKey,
      {
        contentType: file.mimetype,
        contentDisposition: `attachment; filename="${file.originalname}"`,
        metadata: {
          originalName: file.originalname,
          size: String(file.size),
          uploadedBy: personSigId || 'unknown',
        },
      },
    );

    // Create exam attachment
    const examAttachment = this.examAttachmentRepository.create({
      exam,
      fileKey,
      fileName: file.originalname,
      fileType: file.mimetype,
      uploadedBy: personSigId || 'unknown',
    });

    return this.examAttachmentRepository.save(examAttachment);
  }

  async getAttachments(examId: string): Promise<any[]> {
    const examAttachments = await this.examAttachmentRepository.find({
      where: { exam: { id: examId } },
    });

    return Promise.all(
      examAttachments.map(async (examAttachment) => {
        const url = await this.storageProvider.getSignedUrl(
          examAttachment.fileKey,
        );

        return {
          id: examAttachment.id,
          fileName: examAttachment.fileName,
          fileType: examAttachment.fileType,
          uploadedAt: examAttachment.uploadedAt,
          file_url: url,
          uploadedBy: examAttachment.uploadedBy,
        };
      }),
    );
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    const examAttachment = await this.examAttachmentRepository.findOne({
      where: { id: attachmentId },
    });

    if (!examAttachment) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found`,
      );
    }

    // Delete file from storage
    await this.storageProvider.deleteObject(examAttachment.fileKey);

    // Delete exam attachment
    await this.examAttachmentRepository.remove(examAttachment);
  }
}
