import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';
import { IndexDirectoriesParams } from '../types';

export interface DirectoriesListParentDirectoryProps {
  directory: ShowDirectoryAPIResponse;
  indexDirectoriesParams: IndexDirectoriesParams;
  setIndexDirectoriesParams: React.Dispatch<
    React.SetStateAction<IndexDirectoriesParams>
  >;
}

export interface DirectoriesListParentDirectoryContainerProps {
  indexDirectoriesParams: IndexDirectoriesParams;
  organizationId: number;
  setIndexDirectoriesParams: React.Dispatch<
    React.SetStateAction<IndexDirectoriesParams>
  >;
  setParentDirectory: React.Dispatch<React.SetStateAction<number | null>>;
}
