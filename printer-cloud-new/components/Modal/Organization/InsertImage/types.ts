import { ShowOrganizationAPIResponse } from '../../../../services/types';

export interface InsertImageContainerProps {
  organization: ShowOrganizationAPIResponse;
  onSubmit: (s3Url: string) => void;
}

export interface InsertImageProps {
  organization: ShowOrganizationAPIResponse;
  onSubmit: (logoFile: File) => void;
}

export interface InsertImageFormValues {
  logoFile: File | null;
}
