import * as React from 'react';
import { Icon } from 'printer-ui';
import { GeneratePDFStatusIconProps } from './types';
import { GeneratePDFStatus } from '../../../../../PrinterAir/constants';

const GeneratePDFStatusIcon = ({ status }: GeneratePDFStatusIconProps) => {
  switch (status) {
    case GeneratePDFStatus.created:
      return (
        <Icon
          name="loadingCircle"
          alt="loadingCircle"
          color="darkGray"
          stroke
        />
      );
    case GeneratePDFStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case GeneratePDFStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case GeneratePDFStatus.running:
      return (
        <Icon
          name="loadingCircle"
          alt="loadingCircle"
          className="animate-spin"
          color="yellow"
          stroke
        />
      );
    default:
      return null;
  }
};

export default GeneratePDFStatusIcon;
