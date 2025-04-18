import IAttachment from './IAttachment';

export type ICreateAttachment = Omit<
  Partial<IAttachment>,
  'id, file_url, created_at, updated_at, deleted_at'
>;
