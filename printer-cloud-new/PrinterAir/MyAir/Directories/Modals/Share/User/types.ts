import {
  IndexDirectory,
  IndexSharedDirectories,
} from '../../../../../../services/printer-air/types';

export interface ShareListDirectoryModalContainerProps {
  directory: IndexDirectory;
}

export interface ShareDirectoryModalUserListProps {
  sharedDirectories: Array<IndexSharedDirectories>;
}
