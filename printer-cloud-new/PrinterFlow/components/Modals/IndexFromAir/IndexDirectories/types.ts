import { IndexDirectory } from '../../../../../services/printer-air/types';
import { TotalObject } from '../IndexDocuments/types';

export interface IndexDirectoriesFromAirProps {
  directories: Array<IndexDirectory>;
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
}

export interface IndexDirectoriesFromAirContainerProps {
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
  directoryId: number;
  total: TotalObject;
  setTotal: React.Dispatch<React.SetStateAction<TotalObject>>;
}
