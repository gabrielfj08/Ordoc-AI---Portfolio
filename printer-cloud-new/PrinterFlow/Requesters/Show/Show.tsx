import * as React from 'react';
import { Typography } from 'printer-ui';
import { ShowProps } from './types';
import ShowAddress from './../../components/Requesters/Show/Address/Address';
import ShowRequesters from './../../components/Requesters/Show/Requester/Requester';

const Show = ({ requester }: ShowProps) => {
  return (
    <div className="m-1 items-center justify-center md:mt-5 md:space-y-0 w-full h-full sm:block mb-6">
      <div className="space-y-6 pl-4 sm:pl-0">
        <Typography family="robotoBold" variant="title2">
          Dados do solicitante
        </Typography>
        <ShowRequesters requester={requester} />
      </div>
      <div className="space-y-4 pt-6 pl-4 sm:pl-0">
        <Typography family="robotoBold" variant="title2">
          Endereço
        </Typography>
        <ShowAddress requester={requester} />
      </div>
    </div>
  );
};

export default Show;
