import * as React from 'react';
import getConfig from 'next/config';
import { Typography, Icon } from 'printer-ui';
import { removeFileExtension } from '../../../../../utils';
import { ShowAttachmentInfoProps } from './types';
import { ProcedureTemplateDocumentService } from '../../../../../services/printer-flow';
import { useAuth, useSnackbar } from '../../../../../hooks';

const ShowAttachmentInfo = ({
  procedureTemplateDocuments,
  procedureTemplateId,
}: ShowAttachmentInfoProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <div className="sm:w-full w-80 space-y-2">
        {procedureTemplateDocuments.procedureTemplateDocuments.map(
          (procedureTemplateDocument) => (
            <div
              key={procedureTemplateDocument.id}
              onClick={() => {
                ProcedureTemplateDocumentService.show(
                  token,
                  subdomain,
                  procedureTemplateId,
                  procedureTemplateDocument.id
                )
                  .then((document) => {
                    window.document.open(
                      `${apiUrl}/${document.documentUrl}`,
                      '_blank',
                      'noreferrer'
                    );
                  })
                  .catch((error) => {
                    showSnackbar(error.response.data.message, 'error');
                  });
              }}
            >
              <div
                className="flex items-center bg-lighterGray rounded-lg px-4 py-2
       justify-between truncate w-full"
              >
                <div className="flex items-center space-x-2 w-full truncate">
                  <Icon alt="pdfFile" name="pdfFileV2" w={28} h={28} fill />
                  <Typography variant="footnote1" className="w-full truncate">
                    {removeFileExtension(procedureTemplateDocument.name)}
                  </Typography>
                </div>
                <Icon alt="eye" name="eye" w={28} h={28} fill />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShowAttachmentInfo;
