import {
  UpdatePasswordAPIResponse,
  UpdatePasswordPayload,
} from '@/services/ordoc-cidadao/types';

export interface ChangePasswordProps {
  handleSubmit: (
    values: UpdatePasswordPayload
  ) => Promise<UpdatePasswordAPIResponse>;
}
