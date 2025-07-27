import * as React from 'react';
import { PreviewDocumentModalContentContainerProps } from './types';
import PreviewDocumentModalContent from './Content';

const PreviewDocumentModalContentContainer = ({
  document,
}: PreviewDocumentModalContentContainerProps) => {
  return <PreviewDocumentModalContent document={document} />;
};

export default PreviewDocumentModalContentContainer;
