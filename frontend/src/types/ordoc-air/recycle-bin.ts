export interface RecycleBinProps {}

export interface RecycleBinContainerProps {}

export interface RowSelectedItem {
  id: number;
  name: string;
}

export interface DeletedDocument {
  id: number;
  originalFilename: string;
  size: number;
  mimeType: string;
  deletedAt: string;
  deletedBy: {
    id: number;
    name: string;
    email: string;
  };
  directory: {
    id: number;
    name: string;
    path: string;
  };
}

export interface DeletedDirectory {
  id: number;
  name: string;
  path: string;
  deletedAt: string;
  deletedBy: {
    id: number;
    name: string;
    email: string;
  };
  parentDirectory: {
    id: number;
    name: string;
    path: string;
  } | null;
}

export interface RecycleBinDocumentsTableProps {
  setSelectedDocuments?: (items: RowSelectedItem[]) => void;
}

export interface RecycleBinDirectoriesTableProps {
  setSelectedDirectories?: (items: RowSelectedItem[]) => void;
}

export interface RecycleBinSelectedItemsMenuButtonProps {
  selectedDocuments: RowSelectedItem[];
  selectedDirectories: RowSelectedItem[];
}

export interface RestoreItemsModalProps {
  selectedDocuments: RowSelectedItem[];
  selectedDirectories: RowSelectedItem[];
  onClose: () => void;
}
