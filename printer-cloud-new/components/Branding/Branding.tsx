import * as React from 'react';
import Image from 'next/image';

const Branding = () => {
  return (
    <div className="w-28 h-[100px] sm:w-44 sm:h-[159px] relative">
      <Image
        src="/assets/printer-cloud-new-logo-v2.svg"
        alt="Printer Cloud Logo"
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default Branding;
