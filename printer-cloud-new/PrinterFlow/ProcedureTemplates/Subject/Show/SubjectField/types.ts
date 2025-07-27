import { ShowProcedureTemplate } from '../../../../../services/printer-flow/types';
import { BaseField } from '../../../../../services/printer-flow/types/field';
export interface ShowFieldSubjectContainerProps {
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowFieldSubjectProps {
  procedureTemplate: ShowProcedureTemplate;
  fields: Array<BaseField>;
  totalDocs: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface ShowFieldSubjectEmptyProps {
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowFieldSubjectErrorProps {
  procedureTemplate: ShowProcedureTemplate;
}
