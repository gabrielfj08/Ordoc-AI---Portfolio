import * as React from 'react';
import { BreadCrumbsCellContainerProps } from './types';
import BreadCrumbsCell from './BreadCrumbs';

const BreadcrumbCellContainer = ({
  document,
}: BreadCrumbsCellContainerProps) => {
  return <BreadCrumbsCell document={document} />;
};

export default BreadcrumbCellContainer;
