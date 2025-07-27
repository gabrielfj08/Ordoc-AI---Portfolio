import { IndexDocument } from '../../../../services/printer-air/types';
import { rowSelectedItem } from '../../types';

export interface RecycleBinDocumentsTableProps {
  data: Array<IndexDocument>;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<rowSelectedItem[]>>;
}

export interface RecycleBinDocumentsTableContainerProps {
  setSelectedDocuments: React.Dispatch<React.SetStateAction<rowSelectedItem[]>>;
}
