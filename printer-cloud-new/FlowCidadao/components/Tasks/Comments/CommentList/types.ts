import {
  IndexExternalTaskComment,
  ShowExternalTaskAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface TaskCommentListContainerProps {
  task: ShowExternalTaskAPIResponse;
}

export interface TaskCommentListProps {
  taskComments: Array<IndexExternalTaskComment>;
  task: ShowExternalTaskAPIResponse;
}
