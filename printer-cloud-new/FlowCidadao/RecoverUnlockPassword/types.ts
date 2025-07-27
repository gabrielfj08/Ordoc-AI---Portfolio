import {
  GenerateExternalOtpAPIResponse,
  GenerateOtpPayloadExternalNotification,
} from '../../services/flow-cidadao/types';

export interface RecoverUnlockPasswordFormProps {
  secret: string;
  onSubmit: (
    values: RecoverUnlockPasswordForms
  ) => Promise<GenerateExternalOtpAPIResponse>;
}

export interface RecoverUnlockPasswordForms {
  cpfCnpj: string;
  notification: GenerateOtpPayloadExternalNotification;
}
