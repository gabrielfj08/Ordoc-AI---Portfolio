import * as React from 'react';
import { ShareDocumentModalUserListProps } from './types';
import SharedObjectUserList from '../../../../components/SharedObjectList';

const ShareDocumentModalUserList = ({
  sharedDocuments,
}: ShareDocumentModalUserListProps) => {
  return (
    <React.Fragment>
      {sharedDocuments.map((sharedDocument) => (
        <div key={sharedDocument.id}>
          <SharedObjectUserList
            sharedObjectId={sharedDocument.id}
            user={sharedDocument.user}
          />
        </div>
      ))}
    </React.Fragment>
  );
};

export default ShareDocumentModalUserList;
