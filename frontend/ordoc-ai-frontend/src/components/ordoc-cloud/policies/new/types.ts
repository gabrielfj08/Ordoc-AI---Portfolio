// Types for OrdocCloud Policies New component

export type PolicyService = 'ordoc_air' | 'ordoc_flow' | 'ordoc_sign' | 'ordoc_reports' | 'ordoc_cloud';

export type PolicyEffect = 'allow' | 'deny';

export interface NewPolicyContainerProps {
  // Props for the container component
}

export interface NewPolicyProps {
  onSubmit: (values: NewPolicyFormValues) => Promise<Policy>;
}

export interface NewPolicyFormValues {
  name: string;
  description: string;
  service: PolicyService;
  effect: PolicyEffect;
  actionIds: Array<string>;
  resource: Array<string>;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  service: PolicyService;
  effect: PolicyEffect;
  actionIds: Array<string>;
  resource: Array<string>;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAction {
  id: string;
  name: string;
  description: string;
  service: PolicyService;
}

export interface ServiceOption {
  id: PolicyService;
  name: string;
  description: string;
  icon: string;
}

export interface EffectOption {
  id: PolicyEffect;
  name: string;
  description: string;
  color: string;
}
