import { rowSelectedItem } from '../../types';

export interface RestoreItemsModalContainerProps {
  selectedDocuments: Array<rowSelectedItem>;
  selectedDirectories: Array<rowSelectedItem>;
}

export interface RestoreItemsModalProps {
  selectedDocuments: Array<rowSelectedItem>;
  selectedDirectories: Array<rowSelectedItem>;
  onSubmit: (values: RestoreItemsFormValues) => void;
}

export interface RestoreItemsFormValues {
  documentIds;
  directoryIds;
}
