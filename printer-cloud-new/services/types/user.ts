import { APIMetaProperties } from './';
import { userStatus } from '../../types/status';
import { RequestersStatus, RequesterType } from '../printer-flow/types';

export interface BaseUser {
  id: number;
  avatarUrl: string;
  changedPassword: boolean;
  cpf: string;
  dateOfBirth: string;
  email: string;
  name: string;
  phone: string;
  prn: string;
  registrationNumber: string;
  status: userStatus;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowUserByOtpAPIResponse extends BaseUser {
  organizationId: number;
  deletedAt: number | null;
}

export interface ResetPasswordAPIResponse extends ShowUserByOtpAPIResponse {}

export interface ResetPasswordPayload {
  oneTimePassword: string;
  password: string;
}

export interface ActivateUserAPIResponse extends BaseUser {}

export interface DeactivateUserAPIResponse extends BaseUser {}

export interface MeAPIResponse {
  id: number;
  name: string;
  email: string;
  changedPassword: boolean;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  prn: string;
  status: userStatus;
  registrationNumber: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  internalRequester: RequesterUser | null;
}

export interface RequesterUser {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: number | null;
  prn: string;
  code: number;
  email: string;
  optionalEmail: string;
  type: RequesterType;
  status: RequestersStatus;
  phone: string;
  optionalPhone: string;
  occupation: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  cpf: string;
  dateOfBirth: string;
  email: string;
  name: string;
  phone: string;
  registrationNumber: string;
  username: string;
}

export interface CreateUserAPIResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: userStatus;
  username: string;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserAPIResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  prn: string;
  status: userStatus;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  registrationNumber: string;
}

export interface ShowUserAPIResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId?: number;
  phone: string;
  prn: string;
  status: userStatus;
  username: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeactivateUser extends ShowUserAPIResponse {}

export interface PutAddUserGroupPropsAPIResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: userStatus;
  username: string;
  changedPassword: boolean;
  registrationNumber: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export interface AddUserGroupPayload {
  userGroupIds: Array<number>;
}
export interface IndexUsersAPIResponse {
  users: Array<IndexUser>;
  meta: APIMetaProperties;
}

export interface IndexUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  prn: string;
  status: userStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  username: string;
  organizationsCount: number;
  userGroupsCount: number;
}

export interface GenerateOtpPayload {
  username: string;
  notification: GenerateOtpPayloadNotification;
}

export interface GenerateOtpAPIResponse {
  message: string;
}

export type GenerateOtpPayloadNotification = 'email' | 'sms';

export interface SendRandomPasswordAPIResponse {}

export interface SendRandomPasswordPayload {
  notificationType: notificationType;
}

export type notificationType = 'email' | 'sms';

export interface UpdatePasswordAPIResponse {
  id: number;
  name: string;
  email: string;
  cpf: string;
  date_of_birth: string;
  avatar_url: string;
  organization_id: number;
  phone: string;
  prn: string;
  status: string;
  username: string;
  changed_password: boolean;
  registration_number: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
