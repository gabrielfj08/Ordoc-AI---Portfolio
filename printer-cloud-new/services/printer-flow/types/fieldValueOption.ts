import { APIMetaProperties } from '../../types';

export interface IndexFieldValueOptions {
  fieldValueOptions: Array<BaseFieldValueOption>;
  meta: APIMetaProperties;
}

export interface BaseFieldValueOption {
  id: number;
  fieldId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFieldValueOptionPayload {
  value: string;
}
