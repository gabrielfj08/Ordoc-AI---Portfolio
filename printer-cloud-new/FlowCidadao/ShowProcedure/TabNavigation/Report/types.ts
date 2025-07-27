import { IndexExternalJustificationNote } from '../../../../services/flow-cidadao/types';

export interface ReportListProps {
  justificationNotes: Array<IndexExternalJustificationNote>;
  color: string;
}

export interface ReportListContainerProps {
  color: string;
}

export interface ReportMessageProps {
  action: string;
  createdBy: string;
  createdAt: string;
  note: string;
  color: string;
}
