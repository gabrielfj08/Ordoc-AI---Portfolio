import { IndexDocument } from '../../../../services/printer-air/types';

export interface DocumentsTableProps {
  data: Array<IndexDocument>;
  setSelectedDocumentIds: React.Dispatch<React.SetStateAction<number[]>>;
}
