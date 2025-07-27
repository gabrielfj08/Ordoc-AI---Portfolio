import {
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
} from '../../services/flow-cidadao/types';

export interface ResetPasswordProps {
  handleSubmit: (
    values: ResetPasswordPayload
  ) => Promise<ResetPasswordAPIResponse>;
}
