import * as React from 'react';
import Image from 'next/image';
import router from 'next/router';
import { AppBar, Icon } from 'printer-ui';
import VerifySignatures from '../../components/Signatures';

const VerifySignaturesPage = () => {
  if (!router.query.documentToken) return null;
  return (
    <>
      <AppBar
        color="yellow"
        className="w-full flex justify-between px-6 sm:px-0 sm:pr-14"
        image="/../../../assets/cloud-logo.svg"
      >
        <div className="hidden sm:flex items-center">
          <Image
            src="/../../../assets/printer-flow-logo.svg"
            alt="Printer Flow Logo"
            width={187}
            height={46}
          />
        </div>
        <div className="flex items-center sm:hidden w-full justify-between">
          <Icon
            alt="Printer Cloud"
            name="cloud"
            color="white"
            stroke
            w={40}
            h={40}
          />
          <Icon
            alt="Printer Flow"
            name="flow"
            color="white"
            stroke
            w={40}
            h={40}
          />
        </div>
      </AppBar>
      <VerifySignatures documentToken={router.query.documentToken} />
    </>
  );
};

export default VerifySignaturesPage;
