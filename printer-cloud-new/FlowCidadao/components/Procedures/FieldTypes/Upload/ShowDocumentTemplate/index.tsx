import * as React from 'react';
import { useAuth, useExternalAuth } from '../../../../../../hooks';
import {
  AttachmentData,
  UploadProcedureShowDocumentTemplateContainerProps,
} from './types';
import ShowDocumentTemplate from './ShowDocumentTemplate';
import { ExternalFieldService } from '../../../../../../services/flow-cidadao';

const UploadProcedureShowDocumentTemplateContainer = ({
  procedureTemplateId,
  fieldName,
  color,
}: UploadProcedureShowDocumentTemplateContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const [attachmentData, setAttachmentData] = React.useState<AttachmentData>({
    link: '',
    name: '',
  });

  React.useEffect(() => {
    ExternalFieldService.index(
      String(externalToken),
      subdomain,
      procedureTemplateId,
      {
        fieldType: 'attachment',
        q: fieldName,
      }
    ).then((res) => {
      res.fields[0].fieldDocumentTemplate
        ? setAttachmentData({
            link: res.fields[0].fieldDocumentTemplate.documentUrl,
            name: res.fields[0].fieldDocumentTemplate.name,
          })
        : setAttachmentData({
            link: '',
            name: '',
          });
    });
  }, [fieldName]);

  return (
    <ShowDocumentTemplate
      color={color}
      link={attachmentData.link}
      name={attachmentData.name}
    />
  );
};

export default UploadProcedureShowDocumentTemplateContainer;
