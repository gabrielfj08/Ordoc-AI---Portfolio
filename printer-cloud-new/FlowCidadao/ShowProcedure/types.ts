import { ShowExternalProcedureAPIResponse } from '../../services/flow-cidadao/types';

export interface ShowProcedureProps {
  procedure: ShowExternalProcedureAPIResponse;
  generateReport: () => void;
}

export interface ShowProcedureContainerProps {
  setProcedureName: React.Dispatch<React.SetStateAction<string>>;
}
