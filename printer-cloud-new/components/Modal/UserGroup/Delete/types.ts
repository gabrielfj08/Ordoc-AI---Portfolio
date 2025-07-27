import { IndexUserGroup } from '../../../../services/types';

export interface DeleteUserFromGroupProps {
  onSubmit: any;
  userGroup: IndexUserGroup;
}

export interface DeleteUserFromGroupContainerProps {
  userGroup: IndexUserGroup;
}
