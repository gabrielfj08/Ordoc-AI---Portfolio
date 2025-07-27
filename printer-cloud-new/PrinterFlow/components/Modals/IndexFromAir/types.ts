import { taskDocumentSource } from '../../../../services/printer-flow/types/taskDocument';

export interface IndexFromAirContainerProps {
  taskId: number;
}

export interface CreateTaskDocumentFormValues {
  taskDocuments: Array<TaskDocument>;
}

export interface TaskDocument {
  taskDocument: {
    source: taskDocumentSource;
    name: string;
    key: string;
  };
}

export interface DirectoryContentProps {
  directoryId: number;
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
  formik: any;
  isAuthorized: boolean;
}
