import {
  ShowProcedureAPIResponse,
  IndexSignaturesPayload,
} from '../../../../../services/printer-flow/types';

export interface SignaturesTabContainerProps {
  procedure: ShowProcedureAPIResponse;
}

export interface SignaturesTabProps {
  procedure: ShowProcedureAPIResponse;
  params: IndexSignaturesPayload;
  setParams: React.Dispatch<React.SetStateAction<IndexSignaturesPayload>>;
}
