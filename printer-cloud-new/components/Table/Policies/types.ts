import { IndexPoliciesParams } from '../../../types/policy';
import { Policy } from '../../../types';
export interface PoliciesContainerProps {
  filterParams: IndexPoliciesParams;
  setPage: (page: number) => void;
}
export interface PolicyProps {
  policy: Array<Policy>;
}
export interface PolicyCellProps {
  policy: Policy;
}
