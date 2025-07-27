import {
  GenerateOtpPayload,
  ShowUserByOtpAPIResponse,
} from '../../../services/types';

export interface OneTimePasswordFormContainerProps {
  otpPayload: GenerateOtpPayload;
}
export interface OneTimePasswordFormProps {
  onClick: () => void;
  onSubmit: (values: string) => Promise<ShowUserByOtpAPIResponse>;
  isLoading: boolean;
}
