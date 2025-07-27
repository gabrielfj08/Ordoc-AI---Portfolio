import {
  ShowProcedureTemplate,
  UpdateProcedureTemplate,
} from '../../../../services/printer-flow/types/procedureTemplate';

export interface EditSubjectProps {
  onSubmit: (values: EditSubjectFormValues) => Promise<UpdateProcedureTemplate>;
  data: ShowProcedureTemplate;
  parentProcedureTemplate: ShowProcedureTemplate;
}

export interface EditSubjectFormValues {
  name: string;
  source: Array<string>;
  groupRequesterId: number | null;
}
