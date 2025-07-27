import { APIMetaProperties } from '../../types';

export interface CreateTaskPayload {
  name: string;
  description: string;
  procedureId: number;
}

export interface SetAssigneePayload {
  groupAssigneeId: number | null;
}

export interface IndexTasksAPIResponse {
  tasks: Array<IndexTask>;
  meta: APIMetaProperties;
}

export interface IndexTask {
  id: number;
  deadline: string | null;
  priority: taskPriority;
  prn: string;
  groupAssigneeId: number | null;
  procedureId: number;
  name: string;
  description: string;
  assigneeId: number | null;
  createdById: number;
  status: taskStatus;
  createdAt: string;
  updatedAt: string;
  procedureInfo: string;
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee | null;
  procedure: TaskProcedure;
}

export interface BaseTask {
  id: number;
  deadline: string | null;
  priority: taskPriority;
  prn: string;
  groupAssigneeId: number | null;
  procedureId: number;
  name: string;
  description: string;
  assigneeId: number | null;
  createdById: number;
  status: taskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskPayload {
  order?: string;
  direction?: string;
  q?: string;
  page?: number;
  perPage?: number;
  procedureId?: number;
  assigneeId?: number;
  createdById?: number;
  status?: taskStatus;
  priority?: taskPriority;
  groupAssigneeId?: number;
}

export interface AcceptTask {
  id: number;
  deadline: string | null;
  priority: taskPriority;
  prn: string;
  groupAssigneeId: number;
  procedureId: number;
  name: string;
  description: string;
  assigneeId: number;
  createdById: number;
  status: taskStatus;
  createdAt: string;
  updatedAt: string;
  assingnee: TaskAssignee;
  groupAssignee: TaskGroupAssignee;
  createdBy: TaskCreatedBy;
  procedure: TaskProcedure;
}

export interface ShowTaskAPIResponse extends BaseTask {
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee | null;
  createdBy: TaskCreatedBy | null;
  procedure: TaskProcedure | null;
}

export interface DeleteTaskAPIResponse extends BaseTask {
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee | null;
  createdBy: TaskCreatedBy | null;
  procedure: TaskProcedure | null;
}

export interface FinishTaskAPIResponse extends BaseTask {
  assignee: TaskAssignee;
  groupAssignee: TaskGroupAssignee;
  createdBy: TaskCreatedBy;
  procedure: TaskProcedure;
}

export interface ResetTaskAssigneeAPIResponse extends BaseTask {
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee;
  createdBy: TaskCreatedBy;
  procedure: TaskProcedure;
}
export interface ResetTaskAssigneePayload {
  note: string;
  groupAssigneeId: number;
}

export interface AcceptTaskAPIResponse extends BaseTask {
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee | null;
  createdBy: TaskCreatedBy | null;
  procedure: TaskProcedure | null;
}

export interface RefuseTaskAPIResponse extends BaseTask {
  assignee: TaskAssignee | null;
  groupAssignee: TaskGroupAssignee | null;
  createdBy: TaskCreatedBy | null;
  procedure: TaskProcedure | null;
}

export interface RefuseTaskPayload {
  note: string;
}

export interface TaskAssignee {
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
  phone: string;
  optionalPhone: string | null;
  occupation: string | null;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskAssigneeType =
  | 'PrinterFlow::InternalRequester'
  | 'PrinterFlow::ExternalRequester'
  | '';

export type TaskAssigneeStatus = 'active' | 'inactive';

export interface TaskGroupAssignee {
  id: number;
  name: string;
  parentGroupId: number | null;
  prn: string;
  code: number;
  status: TaskGroupAssigneeStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskGroupAssigneeStatus = 'active' | 'inactive';

export interface TaskCreatedBy {
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

export type TaskCreatedByStatus = 'active' | 'inactive';

export interface TaskProcedure {
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
  status: taskStatus;
  schema: Array<SchemaFields> | Array<null>;
  payload: Array<PayloadFields> | Array<null>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTaskAPIResponse extends BaseTask {
  createdBy: TaskCreatedBy | null;
  procedure: TaskProcedure | null;
}

export interface UpdateTaskPayload {
  name: string;
  description: string;
  priority: taskPriority;
  deadline: any;
}

export interface CreateTaskAPIResponse extends ShowTaskAPIResponse {}

export interface SetAssigneeTaskAPIResponse extends ShowTaskAPIResponse {}

export type TaskProcedureSource = '' | 'internal' | 'external';

export interface SchemaFields {
  label: string;
  fieldType: string;
  option?: Array<string>;
}

export interface PayloadFields {
  label: string;
  fieldType: string;
  value: string | Array<string>;
}

export type taskPriority = '' | 'normal' | 'high';

export type taskStatus =
  | ''
  | 'draft'
  | 'running'
  | 'started'
  | 'finished'
  | 'refused'
  | 'doneByMe';
