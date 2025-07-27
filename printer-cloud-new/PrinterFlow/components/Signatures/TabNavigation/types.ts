import { IndexSignaturesPayload } from '../../../../services/printer-flow/types';

export interface SignaturesTabNavigationContainerProps {
  totalAcceptedSignatures: number;
  totalPendingSignatures: number;
  totalRefusedSignatures: number;
}

export interface SignaturesTabsProps {
  children: React.ReactNode;
  totalAcceptedSignatures: number;
  totalPendingSignatures: number;
  totalRefusedSignatures: number;
}

export interface SignaturesTabProps {
  params: IndexSignaturesPayload;
  setParams: React.Dispatch<React.SetStateAction<IndexSignaturesPayload>>;
}
