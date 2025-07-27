import { service } from '../../../services/printer-cloud/types';
import { CreatePolicyAPIResponse } from '../../../services/types';

export interface NewPolicyContainerProps {}

export interface NewPolicyProps {
  onSubmit: (values: NewPolicyFormValues) => Promise<CreatePolicyAPIResponse>;
}

export interface NewPolicyFormValues {
  actionIds: Array<string>;
  description: string;
  effect: string;
  name: string;
  organizationId: number;
  resource: Array<string>;
  service: service & '';
}
