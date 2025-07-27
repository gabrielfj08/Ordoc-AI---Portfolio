import * as React from 'react';
import { SignableExternalDocumentContentProps } from './types';

const SignableExternalDocumentContent = ({
  document,
}: SignableExternalDocumentContentProps) => {
  return (
    <iframe src={document} className="w-full sm:h-[54vh] h-[35vh] rounded-md" />
  );
};

export default SignableExternalDocumentContent;
