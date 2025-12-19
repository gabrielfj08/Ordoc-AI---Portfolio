// Types for OrdocCloud Organizations Edit component

export interface Address {
  street: string;
  number: string;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
}

export interface Organization {
  id: string;
  corporateName: string;
  cnpj?: string;
  email: string;
  phone: string;
  contactName: string;
  contactPhone: string;
  site: string;
  logoUrl: string;
  storageLimit: string;
  appIds: number[];
  address: Address;
  apps?: Array<{
    id: number;
    name: string;
    service: string;
  }>;
}

export interface EditOrganizationContainerProps {
  organizationId: string;
}

export interface EditOrganizationProps {
  data: Organization;
  onSubmit: (values: EditOrganizationFormValues) => Promise<Organization>;
}

export interface EditOrganizationFormValues {
  organization: {
    corporateName: string;
    cnpj?: string;
    email: string;
    phone: string;
    contactName: string;
    contactPhone: string;
    site: string;
    logoUrl: string;
    storageLimit: string;
    appIds: Array<number>;
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
