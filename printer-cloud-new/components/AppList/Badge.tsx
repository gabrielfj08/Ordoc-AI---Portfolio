import * as React from 'react';
import { Icon } from 'printer-ui';

export interface BadgeProps {
  active?: boolean;
}

const Badge = ({ active }: BadgeProps) => {
  return (
    <Icon
      name={active ? 'check' : 'close'}
      alt={active ? 'active' : 'inactive'}
      bgColor={active ? 'success' : 'error'}
      color="white"
      stroke
      fill
      bgStyle="rounded"
      h={25}
      w={25}
    />
  );
};

export default Badge;
