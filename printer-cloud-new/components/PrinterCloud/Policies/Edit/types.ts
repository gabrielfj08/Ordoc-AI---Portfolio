import { service } from '../../../../services/printer-cloud/types';
import { ShowPolicyAPIResponse } from '../../../../services/types';

export interface EditContainerProps {
  policyId: number;
}

export interface EditProps {
  policy: ShowPolicyAPIResponse;
  onSubmit: (values: EditPolicyFormValues) => void;
}

export interface EditPolicyFormValues {
  name: string;
  description: string;
  service: service;
  effect: string;
  actionIds: Array<string>;
  resource: Array<string>;
}
