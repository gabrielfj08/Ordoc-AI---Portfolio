import * as React from 'react';
import { RecentsContainerProps } from './types';
import Recents from './Recents';

const RecentsContainer = ({ organizationId }: RecentsContainerProps) => {
  return <Recents organizationId={organizationId} />;
};

export default RecentsContainer;
