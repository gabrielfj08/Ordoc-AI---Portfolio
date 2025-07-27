import * as React from 'react';
import { Typography } from 'printer-ui';
import { ShareableLinkPreviewerProps } from './types';
import ShareableLinkPreviewerContentContainer from './Content';

const ShareableLinkPreviewer = ({
  shareableLink,
}: ShareableLinkPreviewerProps) => {
  return (
    <>
      <Typography variant="footnote1" align="center">
        Caso não esteja conseguindo visualizar esse documento,{' '}
        <a href={shareableLink.downloadUrl}>
          <span className="text-blue">clique aqui</span>
        </a>{' '}
        para baixá-lo
      </Typography>
      <ShareableLinkPreviewerContentContainer shareableLink={shareableLink} />
    </>
  );
};

export default ShareableLinkPreviewer;
