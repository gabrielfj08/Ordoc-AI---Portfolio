import { IndexDocument } from '../../../../../../services/printer-air/types';

export interface DeletedByCellProps {
  documentDeletedBy: string;
}

export interface DeletedByCellContainerProps {
  document: IndexDocument;
}
