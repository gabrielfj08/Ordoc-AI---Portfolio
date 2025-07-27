import * as React from 'react';
import { EditAddressExternalRequesterProfileContainerProps } from './types';
import EditAddressExternalRequesterProfile from './Address';

const EditAddressExternalRequesterProfileContainer = ({
  color,
}: EditAddressExternalRequesterProfileContainerProps) => {
  return <EditAddressExternalRequesterProfile color={color} />;
};

export default EditAddressExternalRequesterProfileContainer;
