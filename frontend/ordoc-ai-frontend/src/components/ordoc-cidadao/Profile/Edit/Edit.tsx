'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditProfileProps } from './types';
import EditExternalRequesterProfile from './ExternalRequester';
import EditNotificationExternalRequesterProfile from './Notification';
import EditAddressExternalRequesterProfile from './Address';

const EditProfile = ({ externalRequester, setType }: EditProfileProps) => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full space-y-6 pb-4">
        <EditExternalRequesterProfile
          externalRequester={externalRequester}
          setType={setType}
        />
        <EditNotificationExternalRequesterProfile
          externalRequester={externalRequester}
          setType={setType}
        />
        <EditAddressExternalRequesterProfile
          externalRequester={externalRequester}
          setType={setType}
        />
      </div>
    </div>
  );
};

export default EditProfile;
