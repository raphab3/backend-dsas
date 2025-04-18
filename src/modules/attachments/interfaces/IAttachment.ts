export const AttachmentsEnuns = ['attendance_file'] as const;
export const DriversEnuns = ['disk', 's3'] as const;
export type AttachmentsType = (typeof AttachmentsEnuns)[number];
export type StorageDriverType = (typeof DriversEnuns)[number];

export default interface IAttachment {
  id: string;
  filename: string;
  fieldname: string;
  mimetype: string;
  size: number;
  originalname: string;
  path: string;
  storage_drive: StorageDriverType;
  attachment_type: AttachmentsType;
  file_url: string;
  created_at: Date;
  updated_at: Date;
}
