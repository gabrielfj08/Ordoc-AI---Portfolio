import * as React from 'react';
import PreviewDocumentModalContent from './Content';
import { PreviewSharedDocumentContentContainerProps } from './types';

const PreviewSharedDocumentContentContainer = ({
  sharedDocument,
}: PreviewSharedDocumentContentContainerProps) => {
  return <PreviewDocumentModalContent document={sharedDocument.document} />;
};

export default PreviewSharedDocumentContentContainer;
