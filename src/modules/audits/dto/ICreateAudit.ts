export interface ICreateAudit {
  userId: string;
  action: string;
  details: string;
  userIp: string;
  audit_log: string;
  url: string;
  method: string;
  requestBody: any;
  responsePayload: any;
  responseStatus: number;
}
