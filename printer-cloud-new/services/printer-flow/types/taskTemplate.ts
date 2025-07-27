import { APIMetaProperties } from '../../types';
import { BaseTaskField } from './';

export interface BaseTaskTemplate {
  id: number;
  name: string;
  description: string;
  status: taskTemplateStatus;
  organizationId: number;
  prn: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskTemplate extends BaseTaskTemplate {}

export interface IndexTaskTemplatesAPIResponse {
  taskTemplates: Array<IndexTaskTemplate>;
  meta: APIMetaProperties;
}

export interface IndexTaskTemplatesPayload {
  order?: string;
  direction?: string;
  q?: string;
  page?: number;
  perPage?: number;
  status?: taskTemplateStatus;
}

export interface ShowTaskTemplateAPIResponse extends BaseTaskTemplate {
  procedureCount: number;
  taskFields: Array<BaseTaskField>;
}

export interface UpdateTaskTemplateAPIResponse extends BaseTaskTemplate {
  procedureCount: number;
  taskFields: Array<BaseTaskField>;
}

export interface UpdateTaskTemplatePayload {
  name: string;
  description: string;
}

export interface CreateTaskTemplateAPIResponse extends BaseTaskTemplate {
  procedureCount: number;
  taskFields: Array<BaseTaskField>;
}

export interface CreateTaskTemplatePayload {
  name: string;
  description: string;
}

export interface ActivateTaskTemplateAPIResponse extends BaseTaskTemplate {
  procedureCount: number;
  taskFields: Array<BaseTaskField>;
}

export interface DeactivateTaskTemplateAPIResponse extends BaseTaskTemplate {
  procedureCount: number;
  taskFields: Array<BaseTaskField>;
}

export interface DeactivateTaskTemplatePayload {
  note: string;
}

export type taskTemplateStatus = '' | 'active' | 'inactive';
