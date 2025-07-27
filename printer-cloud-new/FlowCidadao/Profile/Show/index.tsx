import * as React from 'react';
import { ShowProfileContainerProps } from './types';
import ShowProfile from './Show';

const ShowProfileContainer = ({
  externalRequester,
  color,
}: ShowProfileContainerProps) => {
  return <ShowProfile externalRequester={externalRequester} color={color} />;
};

export default ShowProfileContainer;
