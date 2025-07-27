import { IndexDirectory } from '../../../../../../services/printer-air/types';

export interface DirectoryCellProps {
  directoryName: string;
  directory: IndexDirectory;
}

export interface DirectoryCellContainerProps {
  directory: IndexDirectory;
}
