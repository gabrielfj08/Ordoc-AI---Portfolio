import * as React from 'react';
import { SignatureStatusTagContainerProps } from './types';
import SignatureStatusTag from './SignatureStatusTag';

const SignatureStatusTagContainer = ({
  status,
}: SignatureStatusTagContainerProps) => {
  return <SignatureStatusTag status={status} />;
};

export default SignatureStatusTagContainer;
