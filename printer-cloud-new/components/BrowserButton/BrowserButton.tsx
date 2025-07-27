import * as React from 'react';
import Image from 'next/image';

export interface imageProps {
  href: string;
  src: string;
}

const BrowserButton = ({ href, src }: imageProps) => {
  return (
    <div className="flex space-x-4">
      <button className="h-[3.125rem] w-[3.125rem] bg-white rounded-lg shadow-[0_4px_13px_0_rgba(0,0,0,0.13)] flex items-center justify-center">
        <a href={href}>
          <Image src={src} width={30} height={30} alt="browser icon" />
        </a>
      </button>
    </div>
  );
};

export default BrowserButton;
