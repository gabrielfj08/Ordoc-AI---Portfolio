export interface ExternalSharedProcedureProps {
  params: FilterExternalSharedProcedureParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterExternalSharedProcedureParams>
  >;
}

export interface FilterExternalSharedProcedureParams {
  order?: string;
  direction?: string;
  page: any;
  perPage: number;
  procedureId?: number;
  externalRequesterId?: number;
  createdById?: number;
  status?: statusExternalSharedProcedure;
}

export type statusExternalSharedProcedure =
  | ''
  | 'created'
  | 'accepted'
  | 'refused'
  | 'allStatus';
