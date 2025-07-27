import * as React from 'react';
import { SignatureActionsDocumentContainerProps } from './types';
import SignatureActionsDocument from './SignatureActions';

const SignatureActionsDocumentContainer = ({
  signature,
}: SignatureActionsDocumentContainerProps) => {
  return <SignatureActionsDocument signature={signature} />;
};

export default SignatureActionsDocumentContainer;
