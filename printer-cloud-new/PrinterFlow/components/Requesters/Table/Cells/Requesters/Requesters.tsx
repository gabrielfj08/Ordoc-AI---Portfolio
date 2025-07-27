import * as React from 'react';
import { Typography } from 'printer-ui';
import { privateCpfCnpj } from '../../../../../../utils';
import { RequestersCellProps } from './types';

const RequestersCell = ({ requesters }: RequestersCellProps) => {
  return (
    <div className="w-44 sm:w-auto sm:px-4 px-2 truncate">
      <Typography variant="footnote1" className="truncate">
        {requesters.name}
      </Typography>
      <Typography variant="footnote1" className="truncate sm:hidden ">
        {privateCpfCnpj(String(requesters.cpfCnpj))}
      </Typography>
    </div>
  );
};

export default RequestersCell;
