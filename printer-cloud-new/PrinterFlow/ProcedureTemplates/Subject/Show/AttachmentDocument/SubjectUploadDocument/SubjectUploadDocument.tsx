import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../../utils';
import { s3KeyToFilename } from '../../../../../../PrinterAir/utils';
import AttachmentUploadStatusIcon from '../../../../../components/ProcedureTemplates/StatusIcon/StatusIcon';

const SubjectDocumentUpload = ({ documentUploadJob }) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5 py-5">
      <Icon
        name="imageV2"
        color="black"
        className="flex-none"
        alt="status"
        fill
      />
      <Typography className="truncate flex-grow">
        {removeFileExtension(s3KeyToFilename(documentUploadJob.s3Key))}
      </Typography>
      <div className="justify-self-end">
        <AttachmentUploadStatusIcon status={documentUploadJob.status} />
      </div>
    </div>
  );
};

export default SubjectDocumentUpload;
