import * as React from 'react';
import getConfig from 'next/config';
import { FieldDocumentTemplateModalContentContainerProps } from './types';
import FieldDocumentTemplateModalContent from './Content';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const FieldDocumentTemplateModalContentContainer = ({
  fieldDocumentTemplate,
}: FieldDocumentTemplateModalContentContainerProps) => {
  return (
    <FieldDocumentTemplateModalContent
      src={`${apiUrl}/${fieldDocumentTemplate.documentUrl}`}
    />
  );
};

export default FieldDocumentTemplateModalContentContainer;
