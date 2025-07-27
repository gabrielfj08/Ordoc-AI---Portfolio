import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { ProceduresCountProps } from './types';

const ProceduresCount = ({ proceduresCount }: ProceduresCountProps) => {
  return (
    <div className="w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default">
      <Icon name="proceduresV3" alt="requesterGroup" stroke w={20} h={20} />
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoMedium">
          Quantidade de processos abertos com o solicitante:
        </Typography>
        <Typography variant="footnote1">{proceduresCount}</Typography>
      </div>
    </div>
  );
};

export default ProceduresCount;
