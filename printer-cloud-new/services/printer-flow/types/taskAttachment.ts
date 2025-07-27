import { APIMetaProperties } from '../../types';
import { taskStatus } from './task';

export interface BaseTaskAttachment {
  id: number;
  attachableId: number;
  attachableType: attachableTypes;
  taskId: number;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskAttachment extends BaseTaskAttachment {
  attachable: AttachableTaskAttachment;
}

export interface IndexTaskAttachmentsAPIResponse {
  taskAttachments: Array<IndexTaskAttachment>;
  meta: APIMetaProperties;
}

export type attachableTypes = '' | 'procedure_document' | 'task_document';

export type taskAttachmentStatus =
  | ''
  | 'failed'
  | 'created'
  | 'running'
  | 'finished';

export interface AttachableTaskAttachment {
  id: number;
  status: taskAttachmentStatus;
  procedureId: number;
  s3Key: string;
  name: string;
  signedDocumentId: number | null;
  documentId: number;
  uuid: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
}

export interface CreatedByTaskAttachment {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: string;
  prn: string;
  code: string | null;
  email: string;
  optionalEmail: string | null;
  type: string;
  status: string;
  blocked: boolean;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskAttachmentPayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  taskId?: number;
  attachableId?: number;
  attachableType?: attachableTypes;
}

export interface ShowTaskAttachmentAPIResponse extends BaseTaskAttachment {
  task: TaskAttachmentTask;
  attachable: AttachableTaskAttachment;
  createdBy: CreatedByTaskAttachment;
}

export interface TaskAttachmentTask {
  id: number;
  deadline: string | null;
  priority: string;
  prn: string;
  groupAssigneeId: number | null;
  procedureId: number;
  name: string;
  description: string;
  assigneeId: number | null;
  taskTemplateId: number | null;
  createdById: number;
  status: taskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskAttachmentAPIResponse {
  id: number;
  ids: Array<number>;
  payload: CreateTaskAttachmentAPIResponsePayload;
  action: string;
  recordType: string;
  createdById: number;
  status: taskAttachmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskAttachmentAPIResponsePayload {
  procedureDocumentIds: Array<number>;
  taskDocumentIds: Array<number>;
}

export interface CreateTaskAttachmentPayload {
  taskId: number;
  procedureDocumentIds: Array<number>;
  taskDocumentIds: Array<number>;
}

export interface DeleteTaskAttachmentAPIResponse extends BaseTaskAttachment {
  task: TaskAttachmentTask;
  attachable: AttachableTaskAttachment;
  createdBy: CreatedByTaskAttachment;
}
