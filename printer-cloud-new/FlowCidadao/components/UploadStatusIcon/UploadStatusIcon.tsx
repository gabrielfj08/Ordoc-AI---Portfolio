import * as React from 'react';
import { Icon } from 'printer-ui';
import { StatusIconProps, UploadStatus } from './types';

const UploadStatusIcon = ({ status, color }: StatusIconProps) => {
  switch (status) {
    case UploadStatus.created:
      return (
        <Icon
          name="loader"
          alt="loading"
          className="animate-spin"
          stroke
          color={color}
          h={16}
          w={16}
        />
      );
    case UploadStatus.running:
      return (
        <Icon
          name="loader"
          alt="loading"
          className="animate-spin"
          stroke
          color={color}
          h={16}
          w={16}
        />
      );
    case UploadStatus.finished:
      return (
        <Icon
          name="checkV3"
          alt="finished"
          color="success"
          stroke
          h={16}
          w={16}
        />
      );
    case UploadStatus.failed:
      return (
        <Icon name="alertV3" alt="failed" color="error" stroke h={16} w={16} />
      );

    default:
      return null;
  }
};

export default UploadStatusIcon;
