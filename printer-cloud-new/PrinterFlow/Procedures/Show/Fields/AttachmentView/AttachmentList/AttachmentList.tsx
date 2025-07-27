import * as React from 'react';
import { Typography } from 'printer-ui';
import { AttachmentListProps } from '../types';
import AttachmentListItem from '../AttachmentItem';

const AttachmentList = ({
  attachments,
  fieldName,
  procedureId,
}: AttachmentListProps) => {
  return (
    <div className="grid w-full">
      <Typography variant="footnote1" family="robotoMedium" className="mb-2">
        {fieldName}:
      </Typography>
      <div className="space-y-2 max-h-32 overflow-x-auto w-full cursor-pointer">
        {attachments.map((attachment) => (
          <AttachmentListItem
            key={attachment.id}
            procedureId={procedureId}
            procedureDocumentUuid={attachment.uuid}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;
