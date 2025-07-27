import * as React from 'react';
import { EditNotificationExternalRequesterProfileContainerProps } from './types';
import EditNotificationExternalRequesterProfile from './Notification';

const EditNotificationExternalRequesterProfileContainer = ({
  color,
}: EditNotificationExternalRequesterProfileContainerProps) => {
  return <EditNotificationExternalRequesterProfile color={color} />;
};

export default EditNotificationExternalRequesterProfileContainer;
