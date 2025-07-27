import * as React from 'react';
import { Button, ButtonGroup, Icon, Skeleton, Typography } from 'printer-ui';
import router from 'next/router';

const SkeletonFlowProfile = () => {
  return (
    <div className="py-5 px-4 z-50">
      <div>
        <div className="items-center justify-center flex pb-4">
          <Typography
            variant="footnote1"
            family="robotoBold"
            className="truncate"
          >
            Selecione o grupo:
          </Typography>
        </div>
        <div className="pb-4">
          <Skeleton w="auto" h={9} rounded="md" />
        </div>
      </div>
      <div className="items-center justify-center flex">
        <Skeleton w={24} h={24} rounded="full" />
      </div>
      <div className="justify-center items-center flex pt-4">
        <Skeleton w={32} h={6} rounded="md" />
      </div>
      <div className="pt-2 pb-2 items-center flex justify-center">
        <Button
          label="Editar perfil"
          outlined
          color="gray"
          size="md"
          className="hover:bg-lighterGray px-9 py-5"
        />
      </div>
      <div className="sm:h-20 h-fit flex flex-col items-center mx-6 space-y-5 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-center mt-3 mb-5">
        <div
          className={`h-16 sm:h-14 sm:w-14 bg-gray w-full rounded-xl flex items-center justify-center space-x-3 cursor-pointer
          ${router.pathname.match('/printer-cloud') ? 'hidden' : 'block'}`}
        >
          <Icon
            alt="printer cloud"
            name="cloud"
            w={50}
            h={50}
            color="white"
            stroke
          />
          <Typography
            variant="footnote1"
            family="robotoBold"
            color="white"
            className="sm:hidden"
          >
            Printer Cloud
          </Typography>
        </div>
        <div
          className={`h-16 sm:h-14 sm:w-14 bg-gray w-full rounded-xl flex items-center justify-center space-x-3 cursor-pointer ${
            router.pathname.match('/printer-air') ? 'hidden' : 'block'
          }`}
        >
          <Icon
            alt="printer air"
            name="air"
            w={50}
            h={50}
            color="white"
            stroke
          />
          <Typography
            variant="footnote1"
            family="robotoBold"
            color="white"
            className="sm:hidden"
          >
            Printer Air
          </Typography>
        </div>
        <div
          className={`h-16 sm:h-14 sm:w-14 bg-gray w-full rounded-xl flex items-center justify-center space-x-3 cursor-pointer ${
            router.pathname.match('/printer-flow') ? 'hidden' : 'block'
          }`}
        >
          <Icon
            alt="printer flow"
            name="flow"
            w={48}
            h={48}
            color="white"
            stroke
          />
          <Typography
            variant="footnote1"
            family="robotoBold"
            color="white"
            className="sm:hidden"
          >
            Printer Flow
          </Typography>
        </div>
      </div>
      <div className="flex">
        <ButtonGroup.Button
          component={() => (
            <Button
              className="border-none mr-3 pl-14 -ml-9"
              color="gray"
              label="FAQ"
              outlined
            >
              <Button.Icon
                name="tutorials"
                alt="tutorials"
                color="gray"
                fill
                w={26}
                h={26}
              />
            </Button>
          )}
        />
        <ButtonGroup.Button
          component={() => (
            <Button className="border-none" color="gray" label="Sobre" outlined>
              <Button.Icon
                name="info"
                alt="info"
                color="gray"
                stroke
                w={25}
                h={25}
              />
            </Button>
          )}
        />
      </div>
      <div className="flex  pt-4 items-center justify-center">
        <Button color="gray" size="sm" label="Sair do sistema" className="py-5">
          <Button.Icon
            name="exit"
            alt="exit"
            color="white"
            fill
            w={23}
            h={23}
          />
        </Button>
      </div>
    </div>
  );
};

export default SkeletonFlowProfile;
