import * as React from 'react';
import { ShowProfileProps } from './types';
import ShowExternalRequesterProfile from './ExternalRequester';
import ShowNotificationExternalRequesterProfile from './Notification';
import ShowAddressExternalRequesterProfile from './Address';

const ShowProfile = ({ externalRequester, color }: ShowProfileProps) => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full space-y-2 pb-4 px-4 sm:px-0">
        <ShowExternalRequesterProfile
          externalRequester={externalRequester}
          color={color}
        />
        <ShowNotificationExternalRequesterProfile
          externalRequester={externalRequester}
          color={color}
        />
        <ShowAddressExternalRequesterProfile
          externalRequester={externalRequester}
          color={color}
        />
      </div>
    </div>
  );
};

export default ShowProfile;
