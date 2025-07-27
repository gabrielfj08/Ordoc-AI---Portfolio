import React from 'react';
import { ShowProcedureDocumentAPIResponse } from '../../../../../services/printer-flow/types';

export interface AttachmentListItemContainerProps {
  procedureId: number;
  procedureDocumentUuid: string;
  procedureDocumentView: Array<string>;
  setProcedureDocumentView: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export interface AttachmentListItemProps {
  item: ShowProcedureDocumentAPIResponse;
  procedureDocumentView: Array<string>;
  setProcedureDocumentView: React.Dispatch<React.SetStateAction<Array<string>>>;
}
