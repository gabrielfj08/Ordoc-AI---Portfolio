import * as React from 'react';
import { Typography } from 'printer-ui';

const Topic = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <Typography variant="title2" family="robotoMedium">
        {title}
      </Typography>
      <div>{children}</div>
    </div>
  );
};

export default Topic;
