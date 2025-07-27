import * as React from 'react';
import { EditExternalRequesterProfileContainerProps } from './types';
import EditExternalRequesterProfile from './ExternalRequester';

const EditExternalRequesterProfileContainer = ({
  externalRequester,
  color,
}: EditExternalRequesterProfileContainerProps) => {
  return (
    <EditExternalRequesterProfile
      externalRequester={externalRequester}
      color={color}
    />
  );
};

export default EditExternalRequesterProfileContainer;
