import { APIMetaProperties } from '../../types';

export interface BaseTaskField {
  id: number;
  label: string;
  fieldableType: string;
  fieldableId: number;
  fieldType: fieldTypeParams;
  options: Array<string | number>;
  value: string | number;
  arrayValues: Array<string | number>;
  createdAt: string;
  updatedAt: string;
}

export interface IndexTaskField extends BaseTaskField {}

export interface IndexTaskFieldsAPIResponse {
  taskFields: Array<IndexTaskField>;
  meta: APIMetaProperties;
}

export interface IndexTaskFieldsPayload {
  order?: string;
  direction?: string;
  q?: string;
  page?: number;
  perPage?: number;
  fieldType?: fieldTypeParams;
}

export interface ShowTaskFieldAPIResponse extends BaseTaskField {}

export interface CreateTaskFieldAPIResponse extends BaseTaskField {}

export interface CreateTaskFieldPayload {
  label: string;
  fieldType: fieldTypeParams;
  options: Array<string | number>;
}

export interface UpdateTaskFieldAPIResponse extends BaseTaskField {}

export interface UpdateTaskFieldPayload {
  label: string;
  fieldType: fieldTypeParams;
  options: Array<string | number>;
}

export interface DeleteTaskFieldAPIResponse extends BaseTaskField {}

export type fieldTypeParams =
  | 'cpf'
  | 'cnpj'
  | 'radio'
  | 'checkbox'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'select_field'
  | 'numeric'
  | 'short_text'
  | 'long_text';
