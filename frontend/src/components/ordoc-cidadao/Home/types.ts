export interface HomeProps {
  reportId: number;
}

export interface CardsContainerProps {
  reportId: number;
}

export interface CardsProps {
  reportData: {
    proceduresRunningCount: number;
    proceduresStartedCount: number;
    tasksRunningCount: number;
    signaturesPendingCount: number;
    sharedProceduresPendingCount: number;
  };
  handleClick: () => void;
}

export interface ShowExternalReportAPIResponse {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  proceduresRunningCount: number;
  proceduresStartedCount: number;
  tasksRunningCount: number;
  signaturesPendingCount: number;
  sharedProceduresPendingCount: number;
}
