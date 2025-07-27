import * as React from 'react';
import { ShareableLinksHistoryModalProps } from './types';
import ShareableLinksModalHistoryItem from './Item';

const ShareableLinksHistoryModal = ({
  documentId,
  shareableLinks,
}: ShareableLinksHistoryModalProps) => {
  return (
    <ShareableLinksModalHistoryItem
      documentId={documentId}
      shareableLinks={shareableLinks}
    />
  );
};

export default ShareableLinksHistoryModal;
