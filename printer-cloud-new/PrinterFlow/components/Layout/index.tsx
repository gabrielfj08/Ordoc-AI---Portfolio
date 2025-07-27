import * as React from 'react';
import Image from 'next/image';
import { ButtonRounded, Icon } from 'printer-ui';
import { LayoutProps } from './types';
import { useDrawer } from '../../../hooks';
import FlowUserButton from './UserButton';
import Sidebar from './Sidebar';

const PrinterFlowLayout = ({ children }: LayoutProps) => {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <div className="w-screen h-full min-h-screen m-0 p-0 overflow-hidden">
      <div className="flex h-fit md:h-28 bg-yellow w-full md:pr-10 md:pl-4 ">
        <div className="hidden lg:flex lg:items-center lg-justify-center h-full w-2/12 relative mr-10">
          <Image
            src="/../../../assets/printer-flow-logo.svg"
            alt="Printer Flow Logo"
            width={224}
            height={112}
          />
        </div>
        <div className="flex items-center w-full px-4 md:p-0 flex-col-reverse md:flex-row md:justify-between">
          <div className="flex justify-between items-center w-full">
            <ButtonRounded
              className="sm:invisible"
              onClick={() =>
                openDrawer(<Sidebar buttonClick={closeDrawer} />, 'left')
              }
            >
              <Icon
                name="sandwich"
                alt="menu"
                color="gray"
                w={20}
                h={20}
                fill
              />
            </ButtonRounded>
            <FlowUserButton />
          </div>
        </div>
      </div>
      <div className="w-full h-full grid justify-items-center">
        <div className="flex w-full max-w-[1920px]">
          <div className="hidden md:flex h-full w-fit">
            <Sidebar buttonClick={closeDrawer} />
          </div>
          <div className="w-full h-full max-w-full overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterFlowLayout;
