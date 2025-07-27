import {
  IndexJustificationNote,
  ShowSignatureAPIResponse,
} from '../../../../../../services/printer-flow/types';

export interface RefuseJustificationNoteContainerProps {
  signature: ShowSignatureAPIResponse;
}

export interface RefuseJustificationNoteProps {
  justificationNote: Array<IndexJustificationNote>;
}
