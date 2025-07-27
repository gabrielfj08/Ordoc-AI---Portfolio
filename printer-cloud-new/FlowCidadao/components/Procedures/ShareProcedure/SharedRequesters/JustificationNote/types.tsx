import {
  IndexExternalJustificationNote,
  IndexSharedProcedure,
} from '../../../../../../services/flow-cidadao/types';

export interface RefuseJustificationNoteProps {
  justificationNotes: Array<IndexExternalJustificationNote>;
}

export interface RefuseJustificationNoteContainerProps {
  sharedProcedure: IndexSharedProcedure;
}
