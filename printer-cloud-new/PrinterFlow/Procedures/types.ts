import { CountProceduresByStatusAPIResponse } from '../../services/printer-flow/types';

export interface ProceduresProps {
  procedures: CountProceduresByStatusAPIResponse;
  userId: number;
}
