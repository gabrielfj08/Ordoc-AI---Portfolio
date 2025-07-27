import { IndexDocument } from '../../../../../../services/printer-air/types';

export interface DeletedAtCellProps {
  documentDeletedAt: string;
}

export interface DeletedAtCellContainerProps {
  document: IndexDocument;
}
