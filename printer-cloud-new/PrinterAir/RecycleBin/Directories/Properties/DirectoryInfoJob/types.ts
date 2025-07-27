import { ShowDirectoryInfoJobAPIResponse } from '../../../../../services/printer-air/types';
export interface CreateDirectoryInfoContainerProps {
  directoryId: number;
}

export interface DirectoryInfoContainerProps {
  directoryId: number;
  directoryInfoId: number;
}

export interface DirectoryInfoJobProps {
  directoryInfo: ShowDirectoryInfoJobAPIResponse;
}
