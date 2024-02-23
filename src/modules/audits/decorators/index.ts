import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_DATA = 'AUDIT_LOG_DATA';
export const AuditLog = (data: string) => SetMetadata(AUDIT_LOG_DATA, data);
