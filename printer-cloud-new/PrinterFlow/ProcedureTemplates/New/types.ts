import { BaseProcedureTemplate } from '../../../services/printer-flow/types';
import { procedureTemplateSource } from '../../../services/printer-flow/types';

export interface NewProcedureTemplateContainerProps {}

export interface NewProcedureTemplateProps {
  onSubmit: (
    values: NewProcedureTemplateFormValues
  ) => Promise<BaseProcedureTemplate>;
}

export interface NewProcedureTemplateFormValues {
  name: string;
  source: Array<string> | Array<null>;
}
