import {
  MeAPIResponse,
  UpdateUserAPIResponse,
} from '../../../../services/types';

export interface EditContainerProps {
  userId: number;
}

export interface EditProfileProps {
  user: MeAPIResponse;
  onSubmit: (values: EditProfileFormValues) => Promise<UpdateUserAPIResponse>;
}

export interface EditProfileFormValues {
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
  avatarUrl: string;
  phone: string;
  registrationNumber: string;
}
