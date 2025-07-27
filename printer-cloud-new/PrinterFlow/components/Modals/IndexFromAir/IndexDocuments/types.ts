import { IndexDocument } from '../../../../../services/printer-air/types';

export interface IndexDocumentsFromAirContainerProps {
  directoryId: number;
  formik: any;
  setDirectoryId: React.Dispatch<React.SetStateAction<number>>;
  total: TotalObject;
  setTotal: React.Dispatch<React.SetStateAction<TotalObject>>;
}

export interface IndexDocumentsFromAirProps {
  documents: Array<IndexDocument>;
  formik: any;
}

export interface TotalObject {
  directories: number | null;
  documents: number | null;
}
