import * as React from 'react';
import { Tab } from '@headlessui/react';
import { SignaturesTabNavigationContainerProps } from './types';
import AcceptedSignaturesTab from './AcceptedSignatures';
import PendingSignaturesTab from './PendingSignatures';
import RefusedSignaturesTab from './RefusedSignatures';
import SignaturesTabs from './TabNavigation';

const SignaturesTabNavigationContainer = ({
  totalAcceptedSignatures,
  totalPendingSignatures,
  totalRefusedSignatures,
}: SignaturesTabNavigationContainerProps) => {
  return (
    <div className="w-full my-6">
      <SignaturesTabs
        totalAcceptedSignatures={totalAcceptedSignatures}
        totalPendingSignatures={totalPendingSignatures}
        totalRefusedSignatures={totalRefusedSignatures}
      >
        <Tab.Panels>
          <PendingSignaturesTab />
          <AcceptedSignaturesTab />
          <RefusedSignaturesTab />
        </Tab.Panels>
      </SignaturesTabs>
    </div>
  );
};

export default SignaturesTabNavigationContainer;
