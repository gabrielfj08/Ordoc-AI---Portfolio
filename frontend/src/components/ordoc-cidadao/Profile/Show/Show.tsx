'use client';

import * as React from 'react';
import { ShowProfileProps } from './types';
import ShowExternalRequesterProfile from './ExternalRequester';
import ShowNotificationExternalRequesterProfile from './Notification';
import ShowAddressExternalRequesterProfile from './Address';

const ShowProfile = ({ externalRequester }: ShowProfileProps) => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full space-y-6 pb-4">
        <ShowExternalRequesterProfile
          externalRequester={externalRequester}
        />
        <ShowNotificationExternalRequesterProfile
          externalRequester={externalRequester}
        />
        <ShowAddressExternalRequesterProfile
          externalRequester={externalRequester}
        />
      </div>
    </div>
  );
};

export default ShowProfile;
