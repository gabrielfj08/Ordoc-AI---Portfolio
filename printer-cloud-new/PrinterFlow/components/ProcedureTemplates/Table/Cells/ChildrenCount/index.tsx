import * as React from 'react';
import { ChildrenCountContainerProps } from './types';
import ChildrenCount from './ChildrenCount';

const ChildrenCountContainer = ({
  procedureTemplates,
}: ChildrenCountContainerProps) => {
  return <ChildrenCount procedureTemplates={procedureTemplates} />;
};

export default ChildrenCountContainer;
