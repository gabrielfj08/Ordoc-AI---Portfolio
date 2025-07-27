import { IndexJustificationNote } from '../../../../services/printer-flow/types';

export interface InactiveProcedureTemplateDetailsContainerProps {
  justifiableId: number;
}

export interface InactiveProcedureTemplateDetailsProps {
  justificationNotes: Array<IndexJustificationNote>;
}
