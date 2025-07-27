import { IndexUser } from '../../../../../../../../services/types';

export interface UserSelectOptionsContainerProps {
  query: string;
  documentId: number;
}

export interface SelectUserOptionsProps {
  users: Array<IndexUser>;
}
