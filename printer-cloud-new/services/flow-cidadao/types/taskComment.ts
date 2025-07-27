import { APIMetaProperties } from '../../types';

export interface IndexExternalTaskCommentsAPIResponse {
  taskComments: Array<IndexExternalTaskComment>;
  meta: APIMetaProperties;
}

export interface IndexExternalTaskComment {
  id: number;
  body: string;
  taskId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}
export interface TaskExternalCommentPayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
}

export interface BaseExternalTaskComment {
  id: number;
  body: string;
  taskId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowExternalTaskCommentAPIResponse {
  id: number;
  body: string;
  taskId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedByTaskExternalComment;
}

export interface CreatedByTaskExternalComment {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: number | null;
  prn: string;
  code: number;
  email: string;
  optionalEmail: string;
  type: createdByType;
  status: string;
  blocked: boolean;
  phone: string;
  optionalPhone: string;
  occupation: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export type createdByType =
  | 'PrinterFlow::InternalRequester'
  | 'PrinterFlow::ExternalRequester'
  | '';

// export interface TaskCommentTask {
//   id: number;
//   status: string;
//   priority: string;
//   deadline: string | null;
//   prn: string;
//   description: string;
//   name: string;
//   createdById: number;
//   assigneeId: number | null;
//   procedureId: number;
//   groupAssigneeId: number | null;
//   createdAt: string;
//   updatedAt: string;
// }

export interface CreateExternalTaskCommentAPIResponse
  extends ShowExternalTaskCommentAPIResponse {}

export interface CreateExternalTaskCommentPayload {
  body: string;
}

export interface UpdateExternalTaskCommentAPIResponse
  extends ShowExternalTaskCommentAPIResponse {}

export interface DeleteExternalTaskCommentAPIResponse
  extends ShowExternalTaskCommentAPIResponse {}

export interface UpdateExternalTaskCommentPayload {
  body: string;
}
