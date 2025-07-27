import * as React from 'react';
import { SignaturesPageProps } from './types';
import SignaturesTabNavigation from '../components/Signatures/TabNavigation';

const SignaturesPage = ({ signatures }: SignaturesPageProps) => {
  return (
    <SignaturesTabNavigation
      totalAcceptedSignatures={signatures.signed}
      totalPendingSignatures={signatures.created}
      totalRefusedSignatures={signatures.refused}
    />
  );
};

export default SignaturesPage;
