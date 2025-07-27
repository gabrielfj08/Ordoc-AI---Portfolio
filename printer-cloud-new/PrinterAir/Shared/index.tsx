import * as React from 'react';
import { SharedContainerProps } from './types';
import Shared from './Shared';

const SharedContainer = ({
  organizationId,
  root,
  parentSharedId,
}: SharedContainerProps) => {
  return (
    <Shared
      organizationId={organizationId}
      root={root}
      parentSharedId={parentSharedId}
    />
  );
};

export default SharedContainer;
