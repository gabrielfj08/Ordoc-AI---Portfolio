import { APIMetaProperties } from '../../types';
import { BaseFieldDocumentTemplate } from './fieldDocumentTemplate';

export interface IndexFields {
  fields: Array<IndexField>;
  meta: APIMetaProperties;
}

export interface BaseField {
  id: number;
  label: string;
  procedureTemplateId: number;
  fieldType: fieldTypeParams;
  required: boolean;
  createdAt: string;
  updatedAt: string;
  fieldDocumentTemplate: BaseFieldDocumentTemplate;
}

export interface IndexField extends BaseField {
  fieldValueOptions: Array<IndexFieldsFieldValueOptions> | Array<null>;
}

export interface IndexFieldsFieldValueOptions {
  id: number;
  fieldId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexFieldParams {
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  fieldType?: fieldTypeParams;
  q?: string;
}

export interface BaseFieldPayload {
  label: string;
  fieldType: fieldTypeParams;
}

export interface AttachDocumentTemplatePayload {
  fieldDocumentTemplateId: number;
}

export interface DetachDocumentTemplatePayload {
  fieldDocumentTemplateId: number;
}

export type fieldTypeParams =
  | 'cpf'
  | 'cnpj'
  | 'radio'
  | 'checkbox'
  | 'email'
  | 'phone'
  | 'attachment'
  | 'date'
  | 'time'
  | 'select_field'
  | 'numeric'
  | 'short_text'
  | 'long_text';
