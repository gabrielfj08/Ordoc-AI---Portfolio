import { CreateUserGroupAPIResponse } from '../../../../services/types';

export interface CreateUserGroupModalContainerProps {}

export interface CreateUserGroupModalProps {
  onSubmit: (
    values: CreateUserGroupModalFormValues
  ) => Promise<CreateUserGroupAPIResponse>;
}

export interface CreateUserGroupModalFormValues {
  name: string;
  description: string;
}
