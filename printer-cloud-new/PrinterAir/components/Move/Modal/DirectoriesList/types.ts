import { IndexDirectory } from '../../../../../services/printer-air/types';
import { IndexDirectoriesParams } from '../types';

export interface DirectoriesListContainerProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  organizationId: number;
  indexDirectoriesParams: IndexDirectoriesParams;
  selectedDirectory: number;
  setIndexDirectoriesParams: React.Dispatch<
    React.SetStateAction<IndexDirectoriesParams>
  >;
}

export interface DirectoriesListProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  directories: Array<IndexDirectory>;
  indexDirectoriesParams: IndexDirectoriesParams;
  selectedDirectory: number;

  setIndexDirectoriesParams: React.Dispatch<
    React.SetStateAction<IndexDirectoriesParams>
  >;
}
