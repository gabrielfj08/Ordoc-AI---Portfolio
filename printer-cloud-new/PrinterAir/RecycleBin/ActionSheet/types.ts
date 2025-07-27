export interface RestoreJobsActionSheetProps {
  restoreDirectoryJobId: number | null;
  restoreDocumentJobId: number | null;
}

export interface MoveJobsActionSheetContainerProps {
  directoryIds: Array<number>;
  documentIds: Array<number>;
}
