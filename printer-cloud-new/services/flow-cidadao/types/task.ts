import { TaskAssigneeType } from '../../printer-flow/types';
import {
  PayloadFields,
  SchemaFields,
  TaskAssigneeStatus,
  TaskCreatedByStatus,
  TaskGroupAssigneeStatus,
  TaskProcedureSource,
  taskPriority,
} from '../../printer-flow/types/task';
import { APIMetaProperties } from '../../types';

export interface IndexExternalTasksParams {
  order?: string;
  direction?: string;
  q?: string;
  page: number;
  perPage: number;
  procedureId?: number;
  assigneeId?: number;
  groupAssigneeId?: number;
  status?: taskExternalStatus;
}

export interface IndexExternalTasksAPIResponse {
  tasks: Array<IndexExternalTask>;
  meta: APIMetaProperties;
}

export interface IndexExternalTask {
  id: number;
  procedureId: number;
  name: string;
  description: string;
  status: taskExternalStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  procedureInfo: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    dateOfBirth: string;
    avatarUrl: string;
    organizationId: number;
    phone: string;
    prn: string;
    status: createdByStatus;
    username: string;
    changedPassword: boolean;
    registrationNumber: string | null;
    createdAt: number;
    updatedAt: number;
    deletedAt: number | null;
  };
}

export type taskExternalStatus =
  | ''
  | 'draft'
  | 'finished'
  | 'refused'
  | 'running'
  | 'started';

export type createdByStatus = 'active' | 'inactive';

export interface ShowExternalTaskAPIResponse {
  id: number;
  procedureId: number;
  name: string;
  description: string;
  status: taskExternalStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  assignee: ExternalTaskAssignee | null;
  groupAssignee: ExternalGroupAssignee | null;
  procedure: ExternalTaskProcedure;
  createdBy: ExternalTaskCreatedBy;
}

export interface ExternalTaskAssignee {
  id: number;
  name: string;
  organizationId: number;
  parentGroupId: number | null;
  cpfCnpj: string;
  prn: string;
  code: string | null;
  email: string;
  optionalEmail: string | null;
  type: TaskAssigneeType;
  status: TaskAssigneeStatus;
  blocked: boolean;
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalGroupAssignee {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: number;
  status: TaskGroupAssigneeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalTaskProcedure {
  id: number;
  deadline: string | null;
  priority: taskPriority;
  private: boolean;
  prn: string;
  organizationId: number;
  processNumber: string;
  responsibleGroupId: number;
  requesterId: number;
  createdById: number;
  procedureTemplateName: string;
  procedureTemplateId: number;
  source: TaskProcedureSource;
  status: taskExternalStatus;
  schema: Array<SchemaFields> | Array<null>;
  payload: Array<PayloadFields> | Array<null>;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalTaskCreatedBy {
  id: number;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  organizationId: number;
  phone: string;
  prn: string;
  status: TaskCreatedByStatus;
  username: string;
  changedPassword: boolean;
  registrationNumber: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AcceptExternalTaskAPIResponse {
  id: number;
  procedureId: number;
  name: string;
  description: string;
  status: taskExternalStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  assignee: ExternalTaskAssignee | null;
  groupAssignee: ExternalTaskGroupAssignee | null;
  createdBy: ExternalTaskCreatedBy;
  procedure: ExternalTaskProcedure;
}

export interface ExternalTaskGroupAssignee extends ExternalTaskAssignee {
  blocked: boolean;
}

export interface RefuseExternalTaskAPIResponse {
  id: number;
  procedureId: number;
  name: string;
  description: string;
  status: taskExternalStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  assignee: ExternalTaskAssignee | null;
  groupAssignee: ExternalTaskGroupAssignee | null;
  createdBy: ExternalTaskCreatedBy;
  procedure: ExternalTaskProcedure;
}

export interface RefuseExternalTaskPayload {
  note: string;
}

export interface FinishExternalTaskAPIResponse
  extends RefuseExternalTaskAPIResponse {}
