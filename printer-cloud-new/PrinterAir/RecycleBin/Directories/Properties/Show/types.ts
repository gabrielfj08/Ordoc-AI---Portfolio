import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';
export interface ShowDirectoryPropertiesContainerProps {
  directoryId: number;
  organizationId: number;
}

export interface ShowDirectoryPropertiesProps {
  directory: ShowDirectoryAPIResponse;
}
