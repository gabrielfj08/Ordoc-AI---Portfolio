export interface BaseExternalRequester {
  id: number;
  organizationId: number;
  name: string;
  email: string;
  cpfCnpj: string;
  status: externalRequesterStatus;
  blocked: boolean;
  prn: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  optionalPhone: string;
  birthDate: string;
  optionalEmail: string;
  occupation: string;
  changedPassword: boolean;
  notification: externalRequesterNotification;
}

export interface ShowExternalRequesterAPIResponse
  extends BaseExternalRequester {
  address: ExternalRequesterAddress;
}

export interface CreateExternalRequesterPayload {
  name: string;
  email: string;
  cpfCnpj: string;
  birthDate: string;
  phone: string;
  optionalPhone: string;
  optionalEmail: string;
  occupation: string;
  notification: externalRequesterNotification;
  address: {
    street: string;
    number: number;
    complement: string | null;
    city: string;
    state: string;
    postalCode: string;
    neighborhood: string;
  };
}

export interface CreateExternalRequesterAPIResponse
  extends BaseExternalRequester {
  address: ExternalRequesterAddress;
}

export interface MeExternalRequesterAPIResponse extends BaseExternalRequester {}

export interface GenerateExternalOtpPayload {
  cpfCnpj: string;
  notification: GenerateOtpPayloadExternalNotification;
}

export interface GenerateExternalOtpAPIResponse {
  message: string;
}

export type GenerateOtpPayloadExternalNotification = '' | 'email' | 'sms';

export type externalRequesterStatus = 'active' | 'inactive';

export type externalRequesterNotification = 'sms' | 'email' | string;

export interface ResetPasswordPayload {
  oneTimePassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordAPIResponse extends BaseExternalRequester {
  address: ExternalRequesterAddress;
}

export interface ExternalRequesterAddress {
  id: number;
  street: string;
  number: number;
  complement: string;
  city: string;
  state: string;
  postalCode: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalRequesterAddressPayload {
  street: string;
  number: number;
  complement: string;
  city: string;
  state: string;
  postalCode: string;
  neighborhood: string;
}

export interface UpdateExternalRequesterAPIResponse
  extends BaseExternalRequester {
  address: ExternalRequesterAddress;
}

export interface UpdateExternalRequesterPayload {
  externalRequester: {
    name: string;
    email: string;
    phone: string;
    optionalPhone: string;
    optionalEmail: string;
    occupation: string;
    notification: externalRequesterNotification;
  };
  address: {
    street: string;
    number: number;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    neighborhood: string;
  };
}

export interface UpdatePasswordAPIResponse extends BaseExternalRequester {
  address: ExternalRequesterAddress;
}
export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
