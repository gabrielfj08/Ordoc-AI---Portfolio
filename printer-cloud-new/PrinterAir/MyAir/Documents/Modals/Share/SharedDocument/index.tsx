import * as React from 'react';
import { SharedDocumentsModalContainerProps } from './types';
import SharedDocumentsModal from './SharedDocuments';

const SharedDocumentsModalContainer = ({
  document,
}: SharedDocumentsModalContainerProps) => {
  return <SharedDocumentsModal document={document} />;
};

export default SharedDocumentsModalContainer;
