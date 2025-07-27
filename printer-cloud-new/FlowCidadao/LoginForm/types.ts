import { LoginAPIResponse } from '../../services/flow-cidadao/types';

export interface LoginFormProps {
  secret: string;
  onSubmit: (values: LoginFormValues) => Promise<LoginAPIResponse>;
}

export interface LoginFormValues {
  cpfCnpj: string;
  password: string;
}
