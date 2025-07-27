import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const GroupRequesterSelectsEmpty = () => {
  return (
    <div className="m-2 flex items-center space-x-2 justify-center py-3">
      <Icon alt="info" name="info" color="gray" stroke />
      <Typography variant="footnote1" color="gray">
        Nenhum grupo encontrado!
      </Typography>
    </div>
  );
};

export default GroupRequesterSelectsEmpty;
