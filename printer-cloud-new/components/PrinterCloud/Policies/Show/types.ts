import { service } from '../../../../services/printer-cloud/types';
import { ShowPolicyAPIResponse } from '../../../../services/types';

export interface ShowPolicyProps {
  policy: ShowPolicyAPIResponse;
}

export interface ShowPolicyContainerProps {
  policyId: number;
}

export interface ShowPolicyFormValues {
  name: string;
  description: string;
  service: service;
  effect: string;
  actionIds: Array<string>;
  resource: Array<string>;
}
