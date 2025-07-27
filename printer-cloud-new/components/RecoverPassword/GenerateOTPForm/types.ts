import {
  GenerateOtpAPIResponse,
  GenerateOtpPayload,
} from '../../../services/types';

export interface GenerateOTPFormProps {
  setFormVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setOtpPayload: React.Dispatch<React.SetStateAction<GenerateOtpPayload>>;
  onSubmit: (values: GenerateOtpPayload) => Promise<GenerateOtpAPIResponse>;
}

export interface GenerateOTPFormContainerProps {
  setFormVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setOtpPayload: React.Dispatch<React.SetStateAction<GenerateOtpPayload>>;
}
