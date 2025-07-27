import { service } from '../../../services/printer-cloud/types';
import { IndexPolicyAction } from '../../../services/types';

export interface PolicyActionsCheckboxGroupContainerProps {
  service: service;
  disabled?: boolean;
}

export interface PolicyActionsCheckboxGroupProps {
  disabled?: boolean;
  policyActions: Array<IndexPolicyAction>;
}
