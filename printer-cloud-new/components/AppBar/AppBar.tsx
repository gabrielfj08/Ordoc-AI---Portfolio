import * as React from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { Button } from 'printer-ui';
import Image from 'next/image';
import { AppBarProps } from './types';

const flowSignaturesUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_FLOW_URL + '/signatures';

const AppBar = ({ onClick }: AppBarProps) => {
  const router = useRouter();

  return (
    <div className="fixed bg-white shadow-[0_4px_13px_0_rgba(0,0,0,0.13)] w-full h-[72px] sm:h-28 grid items-center z-20">
      <div className="flex px-5 sm:px-9 w-full h-full justify-between items-center">
        <div
          className="cursor-pointer w-36 h-[1.4rem] sm:w-64 sm:h-10 relative"
          onClick={onClick}
        >
          <Image
            src="/assets/printer-cloud-logo.svg"
            alt="Printer Cloud Logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex gap-6 w-contain ml-39">
          <Button
            label="Verificador de Assinaturas"
            size="lg"
            color="yellow"
            className="absolute invisible sm:relative sm:visible"
            onClick={() => router.push(flowSignaturesUrl)}
          >
            <Button.Icon
              alt="flow"
              name="flow"
              color="white"
              stroke
              h={23}
              w={23}
            />
          </Button>
          <Button
            size="md"
            color="info"
            className="sm:absolute sm:invisible"
            label="Login"
            onClick={() => router.push('/login')}
          />
          <Button
            size="lg"
            color="info"
            className="absolute sm:relative invisible sm:visible"
            label="Login"
            onClick={() => router.push('/login')}
          />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
