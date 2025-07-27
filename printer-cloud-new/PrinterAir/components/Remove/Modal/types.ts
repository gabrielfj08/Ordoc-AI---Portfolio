export interface RemoveItemsModalContainerProps {
  selectedDirectoryIds: Array<number>;
  selectedDocumentIds: Array<number>;
}

export interface RemoveItemsModalProps {
  onSubmit: (values: RemoveItemsFormValues) => void;
  selectedDirectoryIds: Array<number>;
  selectedDocumentIds: Array<number>;
}

export interface RemoveItemsFormValues {
  directoryIds: Array<number>;
  documentIds: Array<number>;
}
