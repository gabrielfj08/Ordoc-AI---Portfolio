import * as React from 'react';
import { Tag } from 'printer-ui';
import { CellProps } from '../types';

const StatusTag = ({ sharedProcedure }: CellProps) => {
  switch (sharedProcedure.status) {
    case 'created':
      return (
        <Tag
          color="cidOrange"
          bgColor="cidOrangeLight"
          label="AGUARDANDO"
          w="fit"
        />
      );

    case 'accepted':
      return <Tag bgColor="success" label="ACOMPANHANDO" w="fit" />;

    default:
      return null;
  }
};
const StatusCell = ({ sharedProcedure }: CellProps) => {
  return (
    <div className="items-center justify-center flex">
      <StatusTag sharedProcedure={sharedProcedure} />
    </div>
  );
};

export default StatusCell;
