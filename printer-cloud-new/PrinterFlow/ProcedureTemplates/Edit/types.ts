import {
  ShowProcedureTemplate,
  UpdateProcedureTemplate,
} from '../../../services/printer-flow/types/procedureTemplate';

export interface EditProcedureTemplateProps {
  onSubmit: (
    values: EditProcedureTemplateFormValues
  ) => Promise<UpdateProcedureTemplate>;
  data: ShowProcedureTemplate;
}

export interface EditProcedureTemplateFormValues {
  name: string;
  source: Array<string>;
  groupRequesterId?: number | null;
}
