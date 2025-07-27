import { DestroySharedObjectAPIResponse } from '../../../../services/printer-air/types';

export interface ShareModalUserListItemContainerProps {
  sharedObjectId: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export interface ShareModalUserListItemProps {
  sharedObjectId: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
  onSubmit: (values) => Promise<DestroySharedObjectAPIResponse>;
}

export interface ShareModalUserListItemFormValues {
  sharedObjectId: number;
}
