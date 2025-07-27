import * as React from 'react';
import { Icon } from 'printer-ui';
import { DocumentOCRStatus } from '../../../../../../constants';
import { DocumentOCRStatusIconProps } from './types';

const DocumentOCRStatusIcon = ({ status }: DocumentOCRStatusIconProps) => {
  switch (status) {
    case DocumentOCRStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DocumentOCRStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case DocumentOCRStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DocumentOCRStatus.running:
      return (
        <Icon
          className="animate-spin"
          name="air"
          alt="air"
          color="darkGray"
          stroke
        />
      );
    default:
      return null;
  }
};

export default DocumentOCRStatusIcon;
