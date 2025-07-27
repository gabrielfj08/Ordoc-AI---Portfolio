export interface DownloadJobProps {
  downloadJobId: number;
}

export interface DownloadJobActionSheetContainerProps {
  selectedDirectoryIds: Array<number> | Array<null>;
  selectedDocumentIds: Array<number> | Array<null>;
}
