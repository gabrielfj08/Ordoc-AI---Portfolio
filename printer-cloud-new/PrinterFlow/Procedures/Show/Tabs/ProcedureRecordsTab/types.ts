import {
  IndexJustificationNote,
  JustificationNotesParams,
} from '../../../../../services/printer-flow/types';

export interface ProcedureRecordsTabContainerProps {
  justifiableId: number;
}

export interface ProcedureRecordsTabProps {
  params: JustificationNotesParams;
  setParams: React.Dispatch<React.SetStateAction<JustificationNotesParams>>;
  records: Array<IndexJustificationNote>;
  totalObjects: number;
}
