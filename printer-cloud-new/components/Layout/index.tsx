import * as React from 'react';
import { LayoutContainerProps } from './types';
import Layout from './Layout';
export { default as Header } from './Header';

const LayoutContainer = ({ children }: LayoutContainerProps) => {
  return <Layout>{children}</Layout>;
};

export default LayoutContainer;
