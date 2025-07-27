import * as React from 'react';
import { Typography } from 'printer-ui';
import { ChildrenCountProps } from './types';

const ChildrenCount = ({ procedureTemplates }: ChildrenCountProps) => {
  return (
    <div className="hidden sm:flex sm:w-auto sm:h-20 sm:px-4 px-2 truncate justify-center items-center">
      <Typography variant="footnote1" className="truncate">
        {procedureTemplates.childrenCount}
      </Typography>
    </div>
  );
};

export default ChildrenCount;
