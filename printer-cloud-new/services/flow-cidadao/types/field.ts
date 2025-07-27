import { APIMetaProperties } from '../../types';

export interface IndexExternalFieldsAPIResponse {
  fields: Array<IndexExternalField>;
  meta: APIMetaProperties;
}

export interface IndexExternalField {
  id: number;
  label: string;
  procedureTemplateId: number;
  fieldType: externalFieldTypeParams;
  required: boolean;
  createdAt: string;
  updatedAt: string;
  fieldDocumentTemplate: FieldExternalDocumentTemplate;
  fieldValueOptions: Array<ExternalFieldValueOptions> | Array<null>;
}

export interface FieldExternalDocumentTemplate {
  id: number;
  name: string;
  documentUrl: string;
}

export interface ExternalFieldValueOptions {
  id: number;
  fieldId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndexExternalFieldParams {
  q?: string;
  order?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  fieldType?: externalFieldTypeParams;
}

export type externalFieldTypeParams =
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
