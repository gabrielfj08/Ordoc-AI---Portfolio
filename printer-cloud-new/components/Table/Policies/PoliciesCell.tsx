import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { PolicyCellProps } from './types';

const PolicyCell = ({ policy }: PolicyCellProps) => {
  const HandleUrl = () => {
    return (
      <div className="px-4 cursor-pointer">
        <div className="flex gap-2">
          <div>
            <Icon alt="done" name="done" stroke color="gray" w={40} h={40} />
          </div>
          <div className="sm:w-full w-44 truncate">
            <div className="lg:w-[550px] md:w-[450px] w-44 truncate">
              <Typography family="robotoBold" className="truncate">
                {policy.name}
              </Typography>
            </div>
            <div className="lg:w-[550px] md:w-[450px] w-44">
              <Typography className="truncate">{policy.description}</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="items-center cursor-pointer">
      <HandleUrl />
    </div>
  );
};

export default PolicyCell;
