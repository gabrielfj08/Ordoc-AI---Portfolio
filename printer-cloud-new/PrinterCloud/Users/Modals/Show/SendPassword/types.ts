export interface SendPasswordProps {
  buttonDisabling: boolean;
  sendEmailPassword: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  sendSMSPassword: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface SendPasswordContainerProps {
  userId: number;
}
