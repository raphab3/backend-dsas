import { z } from 'zod';
import { AttachmentsEnuns } from '../interfaces/IAttachment';

const attachmentValidation = z.object({
  attachment_type: z.enum([...AttachmentsEnuns]),
  storage_drive: z.enum(['disk', 's3']),
  fieldname: z.string().min(3).max(255),
  filename: z.string().min(3).max(255),
  mimetype: z.string().min(3).max(255),
  originalname: z.string().min(3).max(255),
  path: z.enum([...AttachmentsEnuns]),
  size: z.number(),
  file_url: z.string().min(3).max(255),
});

export default attachmentValidation;
