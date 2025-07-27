export interface RemoveJobsActionSheetContainerProps {
  directoryIds: Array<number>;
  documentIds: Array<number>;
}

export interface RemoveJobsActionSheetProps {
  removeDirectoryJobId: number | null;
  removeDocumentJobId: number | null;
}
