import {
  ShowOrganizationAPIResponse,
  UpdateOrganizationAPIResponse,
} from '../../../services/types';

export interface EditOrganizationContainerProps {
  organizationId: number;
}

export interface EditOrganizationProps {
  data: ShowOrganizationAPIResponse;
  onSubmit: (
    values: EditOrganizationFormValues
  ) => Promise<UpdateOrganizationAPIResponse>;
}

export interface EditOrganizationFormValues {
  organization: {
    corporateName: string;
    email: string;
    phone: string;
    contactName: string;
    contactPhone: string;
    site: string;
    logoUrl: string;
    storageLimit: string;
    appIds: Array<number | null>;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    neighborhood: string;
  };
}
