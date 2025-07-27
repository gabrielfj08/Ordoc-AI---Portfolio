import * as React from 'react';
import { BreadcrumbsContainerProps } from './types';
import Breadcrumbs from './Breadcrumbs';

const BreadcrumbsContainer = ({ path }: BreadcrumbsContainerProps) => {
  return <Breadcrumbs path={path} />
};

export default BreadcrumbsContainer;
