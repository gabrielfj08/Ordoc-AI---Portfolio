import { APIMetaProperties } from '../../types';

export interface AddRequestersToGroupAPIResponse {
  id: number;
  ids: Array<number>;
  payload: AddRequestersToGroupResponsePayload;
  action: string;
  recordType: string;
  createdById: number;
  status: AddRequestersToGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AddRequestersToGroupResponsePayload {
  groupRequesterId: number;
}

export interface AddRequestersToGroupPayload {
  requesterIds: Array<number>;
}

export interface CreateGroupRequesterAPIResponse {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
  ancestorGroupTree: Array<CreateGroupAncestorGroup> | Array<null>;
  usersCount: number;
  parentGroup: null | CreateGroupParentGroup;
}

export interface CreateGroupParentGroup {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number;
  cpfCnpj: string | null;
  prn: string;
  code: string;
  email: string | null;
  optionalEmail: string | null;
  type: string;
  status: GroupRequesterStatus;
  phone: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupAncestorGroup {
  id: number;
  name: string;
  code: string;
}
export interface CreateGroupRequesterPayload {
  groupRequester: CreateGroupRequester;
}

export interface CreateGroupRequester {
  name: string;
  parentGroupId: number | null;
}
export interface IndexGroupRequestersAPIResponse {
  groupRequesters: Array<IndexGroupRequester>;
  meta: APIMetaProperties;
}

export interface IndexGroupRequester {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
  usersCount: number;
}

export interface IndexGroupRequestersOptions {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  status?: GroupRequesterStatus;
  userId?: number;
  q?: string;
  parentGroupId?: number;
}
export interface IndexRequestersFromGroupAPIResponse {
  requestersFromGroup: Array<IndexRequesterFromGroup>;
  meta: APIMetaProperties;
}

export interface IndexRequesterFromGroup {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: null;
  cpfCnpj: string;
  prn: string;
  code: null;
  email: string;
  optionalEmail: string | null;
  type: string;
  status: RequesterStatus;
  phone: string;
  optionalPhone: string | null;
  occupation: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexRequestersFromGroupPayload {
  q?: string;
  order: string;
  direction: string;
  page?: number;
}

export interface RemoveRequesterFromGroupAPIResponse {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
  ancestorGroupTree: Array<RemoveRequesterFromGroupAncestorGroupTree | null>;
  usersCount: number;
  parentGroup: RemoveRequesterFromGroupParentGroup | null;
}

export interface RemoveRequesterFromGroupAncestorGroupTree {
  id: number;
  name: string;
  code: string;
}

export interface RemoveRequesterFromGroupParentGroup {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RemoveRequesterFromGroupPayload {
  requesterId: number;
}

export interface ShowGroupRequesterAPIResponse {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string | null;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
  ancestorGroupTree: Array<ShowGroupRequesterAncestorGroupTree | null>;
  usersCount: number;
  parentGroup: ShowGroupRequesterParentGroup | null;
}

export interface ShowGroupRequesterAncestorGroupTree {
  id: number;
  name: string;
  code: string;
}

export interface ShowGroupRequesterParentGroup {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: string;
  status: GroupRequesterStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShowGroupRequesterCreatedBy {
  id: number;
  name: string;
}

export interface UpdateGroupRequesterAPIResponse {
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
  status: GroupRequesterStatus;
  phone: string | null;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string | null;
  createdAt: string;
  updatedAt: string;
  address: null;
  user: null;
}

export interface UpdateGroupRequesterPayload {
  name: string;
}

export type GroupRequesterStatus = 'active' | 'inactive' | '';

export type RequesterStatus = 'active' | 'inactive';

export type AddRequestersToGroupStatus =
  | 'failed'
  | 'created'
  | 'running'
  | 'finished';
