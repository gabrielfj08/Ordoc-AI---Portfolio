import { ShowProcedureReportsAPIResponse } from '../../../../services/printer-flow/types';

export interface NewProcedureReportContainerProps {
  documentId: number;
  procedureId: number;
}
export interface NewProcedureReportProps {
  procedureReports: ShowProcedureReportsAPIResponse;
}
