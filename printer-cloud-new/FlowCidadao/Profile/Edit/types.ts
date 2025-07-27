import {
  ShowExternalRequesterAPIResponse,
  UpdateExternalRequesterAPIResponse,
  externalRequesterNotification,
} from '../../../services/flow-cidadao/types';

export interface EditProfileContainerProps {
  externalRequester: ShowExternalRequesterAPIResponse;
  color: string;
  setType: React.Dispatch<React.SetStateAction<externalRequesterProfileType>>;
}
export interface EditProfileProps {
  externalRequester: ShowExternalRequesterAPIResponse;
  setType: React.Dispatch<React.SetStateAction<externalRequesterProfileType>>;
  onSubmit: (
    values: EditProfileFormValues
  ) => Promise<UpdateExternalRequesterAPIResponse>;
  color: string;
}

export interface EditProfileFormValues {
  externalRequester: {
    name: string;
    email: string;
    phone: string;
    optionalPhone: string;
    optionalEmail: string;
    occupation: string;
    notification: externalRequesterNotification | string;
  };
  address: {
    street: string;
    number: number;
    complement: string;
    postalCode: string;
    city: string;
    state: string;
    neighborhood: string;
  };
}

export type externalRequesterProfileType = 'show' | 'edit';
