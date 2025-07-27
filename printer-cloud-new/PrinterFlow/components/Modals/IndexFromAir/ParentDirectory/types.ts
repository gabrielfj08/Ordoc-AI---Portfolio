import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface ParentDirectoryProps {
  directory: ShowDirectoryAPIResponse;
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
}

export interface ParentDirectoryContainerProps {
  directoryId: number;
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}
