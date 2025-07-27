import * as React from 'react';
import { AttachmentUploadListProps } from './types';
import AttachmentUploadListItem from '../../AttachmentListItem';
const AttachmentUploadList = ({
  procedureId,
  procedureDocumentView,
  setProcedureDocumentView,
}: AttachmentUploadListProps) => {
  return (
    <div className="space-y-2 max-h-32 overflow-x-auto my-4 w-full">
      {procedureDocumentView.map((procedureDocument) => (
        <AttachmentUploadListItem
          key={procedureDocument}
          procedureId={procedureId}
          procedureDocumentView={procedureDocumentView}
          procedureDocumentUuid={procedureDocument}
          setProcedureDocumentView={setProcedureDocumentView}
        />
      ))}
    </div>
  );
};

export default AttachmentUploadList;
