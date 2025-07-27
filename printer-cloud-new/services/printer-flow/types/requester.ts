import { APIMetaProperties } from '../../types';

export interface BaseRequester {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: string | null;
  prn: string;
  code: string;
  email: string | null;
  optionalEmail: string | null;
  type: string;
  status: RequestersStatus;
  phone: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  birth_date: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexRequestersAPIResponse {
  requesters: Array<IndexRequesters>;
  meta: APIMetaProperties;
}
export interface IndexRequesters {
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

export interface IndexRequestersPayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: RequestersStatus;
  q?: string;
  type?: RequesterType;
  userId?: number;
  parentGroupId?: number;
}

export interface ActivateRequesterAPIResponse {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: number | null;
  prn: string;
  code: string | null;
  email: string | null;
  optionalEmail: string | null;
  type: string;
  status: RequestersStatus;
  phone: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
  address: ActivateRequesterAddress | null;
  user: ActivateRequesterUser | null;
}
export interface ActivateRequesterAddress {
  id: number;
  street: string;
  number: number;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ActivateRequesterCreatedBy {
  id: number;
  name: string;
}

export interface ActivateRequesterUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: string;
  username: string;
  changedPassword: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface DeactivateRequesterAPIResponse {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: number | null;
  prn: string;
  code: number | null;
  email: string | null;
  optionalEmail: string | null;
  type: string;
  status: RequestersStatus;
  phone: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
  address: DeactivateRequesterAddress | null;
  user: DeactivateRequesterUser | null;
}

export interface DeactivateRequesterAddress {
  id: number;
  street: string;
  number: number;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface DeactivateRequesterCreatedBy {
  id: number;
  name: string;
}

export interface DeactivateRequesterUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: string;
  username: string;
  changedPassword: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface DeactivateRequesterPayload {
  note: string;
}

export type RequestersStatus = 'active' | 'inactive' | '';

export type RequesterType =
  | 'InternalRequester'
  | 'ExternalRequester'
  | 'GroupRequester'
  | '';

export interface ShowRequesterAPIResponse {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: null;
  cpfCnpj: string;
  prn: string;
  code: null;
  email: string;
  optionalEmail: string | null;
  type: RequesterType;
  status: RequestersStatus;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  address: ShowRequesterAddress | null;
  user: ShowRequesterUser | null;
}

export interface ShowRequester {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: null;
  cpfCnpj: string;
  prn: string;
  code: null;
  email: string;
  optionalEmail: string | null;
  type: RequesterType;
  status: RequestersStatus;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  address: ShowRequesterAddress | null;
  user: ShowRequesterUser | null;
}
export interface ShowRequesterAddress {
  id: number;
  street: string;
  number: number | string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ShowRequesterUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  prn: string;
  status: string;
  username: string;
  changedPassword: boolean;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateRequesterAPIResponse {}

export interface UpdateRequesterPayloadAddress {
  street: string;
  number: number | string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
}
export interface UpdateRequesterPayload {
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
  birthDate: string;
  optionalPhone: string;
  optionalEmail: string;
  occupation: string;
  address: UpdateRequesterPayloadAddress;
}
