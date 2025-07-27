import { CreateDirectoryAPIResponse } from '../../../../../services/printer-air/types';

export interface NewDirectoryModalContainerProps {
  organizationId: number;
  parentDirectoryId: number;
}

export interface NewDirectoryModalProps {
  onSubmit: (
    values: NewDirectoryFormValues
  ) => Promise<CreateDirectoryAPIResponse>;
}

export interface NewDirectoryFormValues {
  name: string;
  description: string;
}
