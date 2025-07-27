import { APIMetaProperties } from '../../types';
import { RequestersStatus } from './requester';
import { taskPriority, taskStatus } from './task';

export interface IndexTaskCommentsAPIResponse {
  taskComments: Array<IndexTaskComment>;
  meta: APIMetaProperties;
}

export interface IndexTaskComment {
  id: number;
  body: string;
  taskId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseTaskComment {
  id: number;
  body: string;
  taskId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCommentPayload {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
}

export interface ShowTaskCommentAPIResponse {
  id: number;
  body: string;
  taskId: number;
  createdAt: string;
  updatedAt: string;
  createdById: CreatedByIdTaskComment;
  task: TaskCommentTask;
}

export interface CreatedByIdTaskComment {
  id: number;
  organizationId: number;
  name: string;
  email: string;
  cpfCnpj: number | null;
  status: RequestersStatus;
  prn: string;
  createdAt: string;
  updatedAt: string;
  code: number;
  parentGroupId: number | null;
  phone: string;
  optionalPhone: string;
  birthDate: string;
  optionalEmail: string;
  occupation: string;
}

export interface TaskCommentTask {
  id: number;
  status: taskStatus;
  priority: taskPriority;
  deadline: string | null;
  prn: string;
  description: string;
  name: string;
  createdById: number;
  assigneeId: number | null;
  procedureId: number;
  groupAssigneeId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskCommentAPIResponse
  extends ShowTaskCommentAPIResponse {}

export interface CreateTaskCommentPayload {
  body: string;
}

export interface UpdateTaskCommentAPIResponse
  extends ShowTaskCommentAPIResponse {}

export interface DeleteTaskCommentAPIResponse
  extends ShowTaskCommentAPIResponse {}

export interface UpdateTaskCommentPayload {
  body: string;
}
