import { BaseProcedureTemplate } from '../../../../services/printer-flow/types';

export interface NewSubjectContainerProps {
  parentProcedureTemplateId: number;
}

export interface NewSubjectProps {
  onSubmit: (values: NewSubjectFormValues) => Promise<BaseProcedureTemplate>;
  parentProcedureTemplateId: number;
  source: string;
}

export interface NewSubjectFormValues {
  name: string;
  groupRequesterId: number | null;
  parentProcedureTemplateId: number;
  source: Array<string>;
}
