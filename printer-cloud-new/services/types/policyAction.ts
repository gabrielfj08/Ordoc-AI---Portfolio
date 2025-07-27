export interface IndexPolicyActionsAPIResponse
  extends Array<IndexPolicyAction> {}

export interface IndexPolicyAction {
  id: number;
  service: string;
  resource: string;
  action: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  translatedResource: string;
}
