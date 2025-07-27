import { CreateUserAPIResponse } from '../../../../services/types';

export interface NewUserModalContainerProps {}

export interface NewUserModalProps {
  onSubmit: (values: NewUserFormValues) => Promise<CreateUserAPIResponse>;
}

export interface NewUserFormValues {
  cpf: string;
  dateOfBirth: string;
  email: string;
  name: string;
  phone: string;
  registrationNumber: string;
  username: string;
}
