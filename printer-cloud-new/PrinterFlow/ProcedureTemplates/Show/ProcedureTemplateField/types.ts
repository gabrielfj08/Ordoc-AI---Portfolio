import {
  BaseField,
  ShowProcedureTemplate,
} from '../../../../services/printer-flow/types';

export interface ShowProcedureTemplateFieldContainerProps {
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowProcedureTemplateFieldProps {
  fields: Array<BaseField>;
  totalDocs: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowProcedureTemplateFieldEmptyProps {
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowProcedureTemplateFieldErrorProps {
  procedureTemplate: ShowProcedureTemplate;
}
