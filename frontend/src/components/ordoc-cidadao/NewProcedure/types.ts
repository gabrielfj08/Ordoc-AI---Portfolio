import { CreateExternalProcedureAPIResponse } from '@/services/ordoc-cidadao/types';

export interface ExternalProcedureProps {
  onSubmit: (
    values: NewExternalProcedureForms
  ) => Promise<CreateExternalProcedureAPIResponse>;
}

export interface NewExternalProcedureForms {
  procedureTemplateId: number;
}

export interface FilterExternalProceduresParams {
  q?: string;
  order?: string;
  direction?: string;
  page: any;
  perPage: number;
  requesterId?: number;
  status?: statusExternalProcedure;
  createdAtGte?: string;
  createdAtLte?: string;
}

export type statusExternalProcedure =
  | ''
  | 'draft'
  | 'started'
  | 'archived'
  | 'finished'
  | 'running';

export interface Item {
  id: string;
  value: string;
  label: string;
}
