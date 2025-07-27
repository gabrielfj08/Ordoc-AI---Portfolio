import { IndexDirectory } from '../../../../services/printer-air/types';
import { rowSelectedItem } from '../../types';

export interface RecycleBinDirectoriesTableProps {
  data: Array<IndexDirectory>;
  setSelectedDirectories: React.Dispatch<
    React.SetStateAction<rowSelectedItem[]>
  >;
}

export interface RecycleBinDirectoriesTableContainerProps {
  setSelectedDirectories: React.Dispatch<
    React.SetStateAction<rowSelectedItem[]>
  >;
}
