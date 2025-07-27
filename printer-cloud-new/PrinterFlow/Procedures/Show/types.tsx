import {
  IndexJustificationNote,
  ShowProcedureAPIResponse,
  ShowProcedureTemplate,
} from '../../../services/printer-flow/types';

export interface ShowProcedureContainerProps {
  setProcedureNumber: React.Dispatch<React.SetStateAction<string>>;
  justificationNote: IndexJustificationNote;
  subject: ShowProcedureTemplate;
}

export interface ShowProcedureProps {
  subject: ShowProcedureTemplate;
  justificationNote: IndexJustificationNote;
  procedure: ShowProcedureAPIResponse;
}
