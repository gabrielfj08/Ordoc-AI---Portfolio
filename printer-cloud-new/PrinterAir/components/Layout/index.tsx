import * as React from 'react';
import Image from 'next/image';
import { ButtonRounded, Icon } from 'printer-ui';
import { LayoutProps } from './types';
import { useDrawer } from '../../../hooks';
import UserButton from '../../../components/UserButton';
import FilterButton from './FilterButton';
import SearchInput from './SearchInput';
import Sidebar from './Sidebar';

const PrinterAirLayout = ({
  children,
  currentOrganizationId,
  queryString,
}: LayoutProps) => {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <div className="w-screen h-full min-h-screen m-0 p-0 overflow-hidden">
      <div className="flex h-fit md:h-28 bg-red w-full md:pr-10 md:pl-4 ">
        <div className="hidden lg:flex lg:items-center lg-justify-center h-full w-2/12 relative mr-10">
          <Image
            src="/../../../assets/printer-air-logo.svg"
            alt="Printer Air Logo"
            width={224}
            height={112}
          />
        </div>
        <div className="flex items-center w-full px-4 md:p-0 flex-col-reverse md:flex-row md:justify-between">
          <div className="md:flex md:space-x-2 space-y-2 md:space-y-0 w-full py-5 relative">
            <div className="md:w-96">
              <SearchInput />
            </div>
            <div className="md:w-44">
              <FilterButton queryString={queryString} />
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <ButtonRounded
              className="sm:invisible"
              onClick={() =>
                openDrawer(
                  <Sidebar
                    buttonClick={closeDrawer}
                    organizationId={currentOrganizationId}
                  />,
                  'left'
                )
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
            <UserButton currentOrganizationId={0} />
          </div>
        </div>
      </div>
      <div className="w-full h-full grid justify-items-center">
        <div className="flex w-full max-w-[1920px]">
          <div className="hidden md:flex h-full w-fit">
            <Sidebar
              buttonClick={closeDrawer}
              organizationId={currentOrganizationId}
            />
          </div>

          <div className="w-full h-full max-w-full overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterAirLayout;
