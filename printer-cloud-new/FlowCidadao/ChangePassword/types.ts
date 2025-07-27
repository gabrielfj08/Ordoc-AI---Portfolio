import {
  UpdatePasswordAPIResponse,
  UpdatePasswordPayload,
} from '../../services/flow-cidadao/types';

export interface ChangePasswordProps {
  handleSubmit: (
    values: UpdatePasswordPayload
  ) => Promise<UpdatePasswordAPIResponse>;
}
