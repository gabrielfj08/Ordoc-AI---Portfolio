import {
  UpdatePasswordPayload,
  UpdatePasswordAPIResponse,
} from '../../../../services/flow-cidadao/types';

export interface ChangePasswordModalContainerProps {
  externalRequesterId: number;
}

export interface ChangePasswordModalProps {
  handleSubmit: (
    values: ChangePasswordFormValues
  ) => Promise<UpdatePasswordAPIResponse>;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
