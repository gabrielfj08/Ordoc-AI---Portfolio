// Types for OrdocCloud Policy Actions CheckboxGroup component

export type PolicyService = 'ordoc_air' | 'ordoc_flow' | 'ordoc_sign' | 'ordoc_reports' | 'ordoc_cloud';

export interface PolicyActionsCheckboxGroupContainerProps {
  service: PolicyService;
  disabled?: boolean;
  selectedActions?: string[];
  onChange?: (selectedActions: string[]) => void;
  error?: string;
}

export interface PolicyActionsCheckboxGroupProps {
  disabled?: boolean;
  policyActions: PolicyAction[];
  selectedActions?: string[];
  onChange?: (selectedActions: string[]) => void;
  error?: string;
}

export interface PolicyAction {
  id: string;
  name: string;
  description: string;
  service: PolicyService;
  accessLevel: number;
  icon?: string;
  category?: string;
}

export interface PolicyActionCategory {
  id: string;
  name: string;
  description: string;
  actions: PolicyAction[];
}
