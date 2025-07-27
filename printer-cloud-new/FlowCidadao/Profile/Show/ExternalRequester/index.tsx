import * as React from 'react';
import { ShowExternalRequesterProfileContainerProps } from './types';
import ShowExternalRequesterProfile from './ExternalRequester';

const ShowExternalRequesterProfileContainer = ({
  externalRequester,
  color,
}: ShowExternalRequesterProfileContainerProps) => {
  return (
    <ShowExternalRequesterProfile
      externalRequester={externalRequester}
      color={color}
    />
  );
};

export default ShowExternalRequesterProfileContainer;
