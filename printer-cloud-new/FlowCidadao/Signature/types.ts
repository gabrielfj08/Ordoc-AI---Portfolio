export interface ExternalSignatureProps {
  params: FilterExternalSignaturesParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterExternalSignaturesParams>
  >;
}

export interface FilterExternalSignaturesParams {
  order?: string;
  direction?: string;
  page: any;
  perPage: number;
  signableId?: number;
  signableType?: signableTypeExternalSignature;
  createdById?: number;
  procedureId?: number;
  requesterId?: number;
  status?: statusExternalSignature;
  createdAtGte?: string;
  createdAtLte?: string;
}

export type statusExternalSignature =
  | ''
  | 'created'
  | 'running'
  | 'signed'
  | 'refused'
  | 'allStatus';

export type signableTypeExternalSignature =
  | ''
  | 'procedure_document'
  | 'task_document';

export interface Item {
  id: string;
  value: string;
  label: string;
}
