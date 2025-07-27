import { IndexRecentDocument } from '../../../services/printer-air/types';
export interface RecentTableProps {
  data: Array<IndexRecentDocument>;
  setSelectedDocumentIds: React.Dispatch<React.SetStateAction<number[]>>;
}
