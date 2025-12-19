// Types for OrdocCloud Organizations Select component

export interface SelectOrganizationContainerProps {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
}

export interface SelectOrganizationProps {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  organizations: Array<{
    id: string;
    corporateName: string;
    cnpj?: string;
    email: string;
  }>;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
}
