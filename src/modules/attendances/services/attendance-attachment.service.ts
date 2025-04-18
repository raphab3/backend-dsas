import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceAttachment } from '../entities/attendanceAttachment.entity';
import Attachment from '@modules/attachments/entities/Attachment';
import { AttachmentsType } from '@modules/attachments/interfaces/IAttachment';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';

@Injectable()
export class AttendanceAttachmentService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(AttendanceAttachment)
    private attendanceAttachmentRepository: Repository<AttendanceAttachment>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  async uploadAttachment(
    attendanceId: string,
    file: Express.Multer.File,
    personSigId?: string,
  ): Promise<AttendanceAttachment> {
    // Find attendance
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID ${attendanceId} not found`,
      );
    }

    // Create attachment
    const attachmentType: AttachmentsType = 'attendance_file';
    const filename = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    const path = `${attachmentType}/${filename}`;

    const newAttachment = this.attachmentRepository.create({
      fieldname: file.fieldname,
      filename: filename,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
      path: path,
      attachment_type: attachmentType,
      storage_drive: 's3',
    });

    // Save file to storage
    await this.storageProvider.uploadContent(
      file.buffer || Buffer.from(file.path, 'utf-8'),
      path,
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

    // Save attachment to database
    const savedAttachment = await this.attachmentRepository.save(newAttachment);

    // Create attendance attachment relationship
    const attendanceAttachment = this.attendanceAttachmentRepository.create({
      attendance,
      attachment: savedAttachment,
      uploadedBy: personSigId ? ({ id: personSigId } as PersonSig) : null,
    });

    // Save attendance attachment relationship
    return this.attendanceAttachmentRepository.save(attendanceAttachment);
  }

  async getAttachmentsByAttendanceId(attendanceId: string): Promise<any[]> {
    // Find attendance
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: [
        'attendanceAttachments',
        'attendanceAttachments.attachment',
        'attendanceAttachments.uploadedBy',
      ],
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID ${attendanceId} not found`,
      );
    }

    // Get attachments with presigned URLs
    const attachmentsWithUrls = await Promise.all(
      attendance.attendanceAttachments.map(async (attendanceAttachment) => {
        const attachment = attendanceAttachment.attachment;
        const presignedUrl = await this.storageProvider.getSignedUrl(
          attachment.path,
          12 * 60 * 60, // 12 hours expiration
        );

        return {
          id: attachment.id,
          uuid: attachment.uuid,
          filename: attachment.filename,
          originalname: attachment.originalname,
          mimetype: attachment.mimetype,
          size: attachment.size,
          createdAt: attendanceAttachment.createdAt,
          file_url: presignedUrl,
          uploadedBy: attendanceAttachment.uploadedBy
            ? {
                id: attendanceAttachment.uploadedBy.id,
                nome: attendanceAttachment.uploadedBy.nome,
                matricula: attendanceAttachment.uploadedBy.matricula,
              }
            : null,
        };
      }),
    );

    return attachmentsWithUrls;
  }

  async deleteAttachment(
    attendanceId: string,
    attachmentId: string,
  ): Promise<void> {
    // Find attendance attachment
    const attendanceAttachment =
      await this.attendanceAttachmentRepository.findOne({
        where: {
          attendance: { id: attendanceId },
          attachment: { id: attachmentId },
        },
        relations: ['attachment'],
      });

    if (!attendanceAttachment) {
      throw new NotFoundException(
        `Attachment with ID ${attachmentId} not found for attendance ${attendanceId}`,
      );
    }

    // Delete file from storage
    await this.storageProvider.deleteObject(
      attendanceAttachment.attachment.path,
    );

    // Delete attendance attachment relationship
    await this.attendanceAttachmentRepository.remove(attendanceAttachment);

    // Delete attachment
    await this.attachmentRepository.remove(attendanceAttachment.attachment);
  }
}
