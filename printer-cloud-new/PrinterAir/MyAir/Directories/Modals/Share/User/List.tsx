import * as React from 'react';
import { ShareDirectoryModalUserListProps } from './types';
import SharedObjectUserList from '../../../../components/SharedObjectList';

const ShareDirectoryModalUserList = ({
  sharedDirectories,
}: ShareDirectoryModalUserListProps) => {
  return (
    <React.Fragment>
      {sharedDirectories.map((sharedDirectory) => (
        <div key={sharedDirectory.id}>
          <SharedObjectUserList
            sharedObjectId={sharedDirectory.id}
            user={sharedDirectory.user}
          />
        </div>
      ))}
    </React.Fragment>
  );
};

export default ShareDirectoryModalUserList;
