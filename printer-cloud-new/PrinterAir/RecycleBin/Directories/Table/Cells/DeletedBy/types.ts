import { IndexDirectory } from '../../../../../../services/printer-air/types';

export interface DeletedByCellProps {
  directoryDeletedBy: string;
}

export interface DeletedByCellContainerProps {
  directory: IndexDirectory;
}
