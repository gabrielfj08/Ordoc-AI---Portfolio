import { UpdateDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface EditDirectoryContainerModalProps {
  organizationId: number;
  directoryId: number;
  name: string;
  description: string;
}

export interface EditDirectoryModalProps {
  onSubmit: (
    values: EditDirectoryFormValues
  ) => Promise<UpdateDirectoryAPIResponse>;
  name: string;
  description: string;
}

export interface EditDirectoryFormValues {
  description: string;
}
