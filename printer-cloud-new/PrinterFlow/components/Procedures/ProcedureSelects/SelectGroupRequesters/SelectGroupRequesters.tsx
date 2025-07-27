import * as React from 'react';
import { Typography } from 'printer-ui';
import { useSessionGroupRequester } from '../../../../../hooks';

const SelectGroupRequesters = () => {
  const { sessionGroupRequester } = useSessionGroupRequester();

  return (
    <div className="w-full py-1.5 px-4 rounded-md border border-gray">
      <Typography variant="headline" color="gray">
        {sessionGroupRequester?.name}
      </Typography>
    </div>
  );
};

export default SelectGroupRequesters;
