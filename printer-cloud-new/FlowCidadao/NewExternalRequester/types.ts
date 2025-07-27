import {
  CreateExternalRequesterAPIResponse,
  externalRequesterNotification,
} from '../../services/flow-cidadao/types';

export interface NewExternalRequesterFormProps {
  secret: string;
  onSubmit: (
    values: NewExternalRequesterFormValues
  ) => Promise<CreateExternalRequesterAPIResponse>;
}

export interface NewExternalRequesterFormValues {
  name: string;
  email: string;
  cpfCnpj: string;
  birthDate: string;
  phone: string;
  optionalPhone: string;
  optionalEmail: string;
  occupation: string;
  notification: externalRequesterNotification | string;
  address: {
    street: string;
    number: number;
    complement: string;
    city: string;
    state: string;
    postalCode: string;
    neighborhood: string;
  };
}
