import { ICreateAttachment } from '../interfaces/CreateAttachment';

export const getCreateAttachmentDTO = (attachment: ICreateAttachment) => ({
  mimetype: attachment.mimetype,
  fieldname: attachment.fieldname,
  originalname: attachment.originalname,
  filename: attachment.filename,
  size: attachment.size,
  path: attachment.path,
  storage_drive: attachment.storage_drive,
});
