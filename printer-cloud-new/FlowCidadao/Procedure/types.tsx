export interface ExternalProcedureProps {
  params: FilterExternalProceduresParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterExternalProceduresParams>
  >;
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
