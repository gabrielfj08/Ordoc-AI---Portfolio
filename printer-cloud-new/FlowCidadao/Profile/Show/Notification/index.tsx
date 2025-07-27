import * as React from 'react';
import { ShowNotificationExternalRequesterProfileContainerProps } from './types';
import ShowNotificationExternalRequesterProfile from './Notification';

const ShowNotificationExternalRequesterProfileContainer = ({
  externalRequester,
  color,
}: ShowNotificationExternalRequesterProfileContainerProps) => {
  return (
    <ShowNotificationExternalRequesterProfile
      externalRequester={externalRequester}
      color={color}
    />
  );
};

export default ShowNotificationExternalRequesterProfileContainer;
