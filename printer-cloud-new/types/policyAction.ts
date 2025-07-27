import { service } from '../services/printer-cloud/types';

// TODO: REFACTOR TO DEPRECATE IPolicyAction
export type IPolicyAction = {
  id: number;
  service: service;
  resource: string;
  action: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  translatedResource: string;
};

// TODO: REFACTOR TO UNIFY IPolicyAction AND PolicyAction
export type PolicyAction = {
  id: number;
  access_level: string;
  service: string;
  resource: string;
  action: string;
  label: string;
  created_at: string;
  updated_at: string;
  translated_resource: string;
};

export type accessLevel = 'list' | 'read' | 'write';
