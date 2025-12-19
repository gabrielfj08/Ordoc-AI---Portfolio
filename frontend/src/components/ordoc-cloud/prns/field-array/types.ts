// Types for OrdocCloud PRN FieldArray component

export interface PrnFieldArrayContainerProps {
  disabled?: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
  service?: string;
  organizationCnpj?: string;
  error?: string;
}

export interface PrnFieldArrayProps {
  disabled?: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
  service?: string;
  organizationCnpj?: string;
  error?: string;
}

export interface PrnExample {
  id: string;
  title: string;
  description: string;
  pattern: string;
  service: string;
}

export interface PrnValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}
