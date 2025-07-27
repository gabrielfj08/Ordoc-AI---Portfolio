import * as React from 'react';
import router from 'next/router';
import { Popover } from '@headlessui/react';
import {
  AvatarV3 as Avatar,
  Icon,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useExternalAuth, useDrawer } from '../../../hooks';

const AvatarPopover = ({ userName, color }) => {
  const { clearExternalSession } = useExternalAuth();
  const { closeDrawer } = useDrawer();

  const logout = () => {
    clearExternalSession();
    closeDrawer();
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <div className="flex align-center">
          <Popover.Button className="sticky h-16 rounded-lg items-center w-full focus:outline-none flex">
            <div className="h-16 flex items-center p-4 space-x-4 truncate">
              <Avatar
                placeholder={userName.charAt(0)}
                textColor={color}
                color="white"
                onClick={() => {}}
              />
            </div>
          </Popover.Button>
          <Popover.Panel className="absolute left-24 sm:left-20 bottom-1 z-50 h-fit w-fit ml-5 space-y-3">
            <button
              className="flex justify-between items-center bg-white h-9 w-[130px] sm:w-[150px] px-2 rounded-2xl shadow-md"
              onClick={() => router.push('/flow-cidadao/profile')}
            >
              <Typography family="jakarta" variant="bodyMd" color={color}>
                Editar dados
              </Typography>
              <Icon alt="user" name="user" stroke color={color} />
            </button>
            <button
              className="flex justify-between items-center bg-white h-9 w-[80px] sm:w-[90px] px-2 rounded-2xl shadow-md"
              onClick={logout}
            >
              <Typography family="jakarta" variant="bodyMd" color={color}>
                Sair
              </Typography>
              <Icon alt="exit" name="exit" fill color={color} />
            </button>
          </Popover.Panel>
        </div>
      )}
    </Popover>
  );
};

export default AvatarPopover;
