import * as React from 'react';
import getConfig from 'next/config';
import { SignableExternalDocumentContentContainerProps } from './types';
import SignableExternalDocumentContent from './Content';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const SignableExternalDocumentContentContainer = ({
  signature,
}: SignableExternalDocumentContentContainerProps) => {
  return (
    <SignableExternalDocumentContent
      document={`${apiUrl}/${signature.signable.documentUrl}`}
    />
  );
};

export default SignableExternalDocumentContentContainer;
