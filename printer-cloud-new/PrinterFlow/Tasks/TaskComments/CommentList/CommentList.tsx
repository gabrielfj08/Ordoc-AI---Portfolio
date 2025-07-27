import * as React from 'react';
import TaskCommentItem from '../CommentItem';
import { TaskCommentListProps } from './types';

const TaskCommentList = ({ taskComments, taskId }: TaskCommentListProps) => {
  return (
    <>
      {taskComments.map((taskComment) => (
        <TaskCommentItem
          key={taskComment.id}
          taskComments={taskComment}
          taskId={taskId}
        />
      ))}
    </>
  );
};

export default TaskCommentList;
