export interface DocumentsTableContainerProps {
  organizationId: number;
  directoryId: number;
  setSelectedDocumentIds: React.Dispatch<React.SetStateAction<number[]>>;
}
