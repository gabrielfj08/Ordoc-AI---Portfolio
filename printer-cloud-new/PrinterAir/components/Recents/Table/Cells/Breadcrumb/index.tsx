import * as React from 'react';
import { BreadcrumbCellContainerProps } from './types';
import BreadcrumbCell from './Breadcrumb';

const BreadcrumbCellContainer = ({
  recentDocument,
}: BreadcrumbCellContainerProps) => {
  return <BreadcrumbCell recentDocument={recentDocument} />;
};

export default BreadcrumbCellContainer;
