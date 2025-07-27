import { IndexSignaturesPayload } from '../../../../../../services/printer-flow/types';

export interface SignatureProcedureFilterButtonContainerProps {
  children: React.ReactNode;
  params: IndexSignaturesPayload;
  setParams: React.Dispatch<React.SetStateAction<IndexSignaturesPayload>>;
}

export interface SignatureProcedureFilterButtonProps {
  children: React.ReactNode;
  params: IndexSignaturesPayload;
  setParams: React.Dispatch<React.SetStateAction<IndexSignaturesPayload>>;
}
