import * as React from 'react';
import { Typography } from 'printer-ui';
import { privateCpfCnpj } from '../../../../../../utils';
import { RequestersDataCellProps } from './types';

const RequestersDataCell = ({ requesters }: RequestersDataCellProps) => {
  return (
    <div className="sm:w-52 hidden sm:flex items-center justify-center space-x-2 px-4 truncate">
      <Typography variant="footnote1" className="truncate">
        {privateCpfCnpj(String(requesters.cpfCnpj))}
      </Typography>
    </div>
  );
};

export default RequestersDataCell;
