import { IndexJustificationNote } from '../../../../services/printer-flow/types';

export interface InactiveTaskTemplateDetailsContainerProps {
  justifiableId: number;
}

export interface InactiveTaskTemplateDetailsProps {
  justificationNotes: Array<IndexJustificationNote>;
}
