export interface FilterButtonProcedureTemplateProps {
  children: React.ReactNode;
  params: FilterProcedureTemplateParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterProcedureTemplateParams>
  >;
}
export interface FilterButtonProcedureTemplateContainerProps {
  children: React.ReactNode;
  params: FilterProcedureTemplateParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterProcedureTemplateParams>
  >;
}

export interface FilterProcedureTemplateParams {
  order: string;
  direction: string;
  page: number;
  perPage: number;
  source: procedureTemplateSource;
  status: procedureTemplateStatus;
  q: string;
  parentProcedureTemplateId?: number;
  root?: boolean;
}

export type procedureTemplateStatus = '' | 'active' | 'inactive';

export type procedureTemplateSource =
  | ''
  | 'external'
  | 'internal'
  | 'internal_external';
