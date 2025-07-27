import {
  IndexJustificationNote,
  ProcedureRequester,
  ShowProcedureAPIResponse,
  ShowProcedureTemplate,
} from '../../../../services/printer-flow/types';

export interface ShowProcedureInfoContainerProps {
  procedure: ShowProcedureAPIResponse;
  subject: ShowProcedureTemplate;
}

export interface ShowProcedureInfoProps {
  procedure: ShowProcedureAPIResponse;
  requester: ProcedureRequester;
  justificationNote: Array<IndexJustificationNote>;
}

export interface ProcedureInfoCasesProps {
  procedure: ShowProcedureAPIResponse;
}
