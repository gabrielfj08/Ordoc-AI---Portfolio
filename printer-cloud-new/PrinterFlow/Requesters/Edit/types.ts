import {
  ShowRequesterAPIResponse,
  UpdateRequesterAPIResponse,
} from '../../../services/printer-flow/types';

export interface EditRequesterProps {
  data: ShowRequesterAPIResponse;
  onSubmit: (
    values: EditRequesterFormValues
  ) => Promise<UpdateRequesterAPIResponse>;
}

export interface EditRequesterFormValues {
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
  birthDate: string;
  optionalPhone: string;
  optionalEmail: string;
  occupation: string;
  address: {
    street: string;
    number: string;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    neighborhood: string;
  };
}
