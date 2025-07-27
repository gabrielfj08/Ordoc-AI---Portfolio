import {
  ResetPasswordAPIResponse,
  ResetPasswordPayload,
} from '../../../services/types';

export interface ChangePasswordFormProps {
  onSubmit: (values: ResetPasswordPayload) => Promise<ResetPasswordAPIResponse>;
}
