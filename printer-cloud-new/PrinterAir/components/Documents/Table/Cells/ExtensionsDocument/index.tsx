import * as React from 'react';
import ExtensionsDocument from './ExtensionsDocument';
import { ExtensionsDocumentContainerProps } from './types';

const ExtensionsDocumentContainer = ({
  src,
}: ExtensionsDocumentContainerProps) => {
  return <ExtensionsDocument src={src} />;
};

export default ExtensionsDocumentContainer;
