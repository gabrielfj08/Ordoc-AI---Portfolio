import * as React from 'react';
import getConfig from 'next/config';
import { SignableDocumentContentContainerProps } from './types';
import SignableDocumentContent from './Content';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const SignableDocumentContentContainer = ({
  signature,
}: SignableDocumentContentContainerProps) => {
  return (
    <SignableDocumentContent
      document={`${apiUrl}/${signature.signable.documentUrl}`}
    />
  );
};

export default SignableDocumentContentContainer;
