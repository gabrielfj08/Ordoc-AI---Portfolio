import * as React from 'react';
import { AttachmentListProps } from './types';
import AttachmentListItem from './AttachmentListItem';

const AttachmentList = ({ procedureDocuments }: AttachmentListProps) => {
  return (
    <div className="grid sm:grid-cols-3 gap-2 sm:gap-6 w-full">
      {procedureDocuments.map((procedureDocument) => (
        <AttachmentListItem
          key={procedureDocument.id}
          procedureId={procedureDocument.procedureId}
          procedureDocumentUuid={procedureDocument.uuid}
        />
      ))}
    </div>
  );
};

export default AttachmentList;
