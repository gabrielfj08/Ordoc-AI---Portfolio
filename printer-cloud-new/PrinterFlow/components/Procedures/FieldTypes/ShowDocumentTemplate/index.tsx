import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth } from '../../../../../hooks';
import { FieldService } from '../../../../../services/printer-flow';
import ShowDocumentTemplate from './ShowDocumentTemplate';
import { AttachmentData, ShowDocumentTemplateContainerProps } from './types';

const ShowDocumentTemplateContainer = ({
  procedureTemplateId,
  fieldName,
}: ShowDocumentTemplateContainerProps) => {
  const { subdomain, token } = useAuth();

  const [attachmentData, setAttachmentData] = React.useState<AttachmentData>({
    link: '',
    name: '',
  });

  React.useEffect(() => {
    FieldService.index(token, subdomain, procedureTemplateId, {
      fieldType: 'attachment',
      q: fieldName,
    }).then((res) => {
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
      link={attachmentData.link}
      name={attachmentData.name}
    />
  );
};

export default ShowDocumentTemplateContainer;
