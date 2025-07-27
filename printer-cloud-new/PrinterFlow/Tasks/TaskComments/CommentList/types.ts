import { BaseTaskComment } from '../../../../services/printer-flow/types/taskComment';

export interface TaskCommentListContainerProps {
  taskId: number;
}

export interface TaskCommentListProps {
  taskComments: Array<BaseTaskComment>;
  taskId: number;
}
