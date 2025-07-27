import * as React from 'react';
import { ShowAddressExternalRequesterProfileContainerProps } from './types';
import ShowAddressExternalRequesterProfile from './Address';

const ShowAddressExternalRequesterProfileContainer = ({
  externalRequester,
  color,
}: ShowAddressExternalRequesterProfileContainerProps) => {
  return (
    <ShowAddressExternalRequesterProfile
      externalRequester={externalRequester}
      color={color}
    />
  );
};

export default ShowAddressExternalRequesterProfileContainer;
