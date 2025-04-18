import IAttachment, { AttachmentsType } from './IAttachment';

export interface IRequestCreateAttachment {
  file: Omit<
    Partial<IAttachment>,
    'id, file_url, created_at, updated_at, deleted_at, attachment_type'
  >;
  type: AttachmentsType;
}
