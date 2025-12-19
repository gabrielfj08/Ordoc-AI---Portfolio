import { LoginAPIResponse } from '@/types/ordoc-cidadao';

export interface LoginFormProps {
  secret: string;
  onSubmit: (values: LoginFormValues) => Promise<LoginAPIResponse>;
}

export interface LoginFormValues {
  cpfCnpj: string;
  password: string;
}
