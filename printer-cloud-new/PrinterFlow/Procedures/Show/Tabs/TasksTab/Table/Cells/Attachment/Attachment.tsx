import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';

const AttachmentCell = () => {
  return (
    <div className="hidden sm:flex items-center">
      <div
        id={`attachmentTask`}
        data-tooltip-content="Anexo"
        className="hidden sm:flex items-center justify-center"
      >
        <>
          <Icon alt="Attachment" name="clip" w={28} h={28} stroke />
          <ReactTooltip anchorId={`attachmentTask`} />
        </>
      </div>
    </div>
  );
};

export default AttachmentCell;
