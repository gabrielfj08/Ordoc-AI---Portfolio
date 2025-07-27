export interface DocumentsContainerProps {
  directoryId: number;
  setSelectedDocumentIds: React.Dispatch<React.SetStateAction<number[]>>;
  organizationId: number;
}
