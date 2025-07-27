import * as React from 'react';
import { SharedDirectoriesModalContainerProps } from './types';
import SharedDirectoriesModal from './SharedDirectories';

const SharedDirectoriesModalContainer = ({
  directory,
}: SharedDirectoriesModalContainerProps) => {
  return <SharedDirectoriesModal directory={directory} />;
};

export default SharedDirectoriesModalContainer;
