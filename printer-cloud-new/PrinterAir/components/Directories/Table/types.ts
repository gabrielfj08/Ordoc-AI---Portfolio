import { IndexDirectory } from '../../../../services/printer-air/types';

export interface DirectoriesTableProps {
  data: Array<IndexDirectory>;
  setSelectedDirectoryIds: React.Dispatch<React.SetStateAction<number[]>>;
}
