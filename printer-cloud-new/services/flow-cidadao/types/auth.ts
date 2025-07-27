export interface AuthCredentials {
  cpfCnpj: string;
  password: string;
}

export interface LoginAPIResponse {
  data: any;
  organizationId: number;
  id: number;
  name: string;
  email: string;
  cpfCnpj: string;
  status: externalRequesterStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  code: number | null;
  parentGroupId: number | null;
  phone: string;
  optionalPhone?: string;
  birthDate: string;
  optionalEmail?: string;
  occupation: string;
  changedPassword: boolean;
  onTimePassword: string;
  notification: externalRequesterNotification;
}

type externalRequesterStatus = 'active' | 'inactive';

type externalRequesterNotification = 'sms' | 'email';
