import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { s3KeyToFilename } from '../../../../../../PrinterAir/utils';
import { removeFileExtension } from '../../../../../../utils';
import { NewFieldDocumentTemplateUploadProps } from './types';
import NewFieldDocumentTemplateUploadStatusIcon from '../../../../../components/ProcedureTemplates/StatusIcon';

const NewFieldDocumentTemplateUpload = ({
  fieldDocumentTemplate,
}: NewFieldDocumentTemplateUploadProps) => {
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
        {removeFileExtension(s3KeyToFilename(fieldDocumentTemplate.s3Key))}
      </Typography>
      <div className="justify-self-end">
        <NewFieldDocumentTemplateUploadStatusIcon
          status={fieldDocumentTemplate.status}
        />
      </div>
    </div>
  );
};

export default NewFieldDocumentTemplateUpload;
