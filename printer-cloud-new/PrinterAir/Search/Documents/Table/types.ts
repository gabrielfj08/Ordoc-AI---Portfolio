import { SearchDocument } from '../../../../services/printer-air/types';
import { rowSelectedItem } from '../../types';

export interface SearchDocumentsTableProps {
  data: Array<SearchDocument>;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<rowSelectedItem[]>>;
}

export interface SearchDocumentsTableContainerProps {
  queryString: string;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<rowSelectedItem[]>>;
}
