import * as React from 'react';
import { Tag } from 'printer-ui';
import { TaskStatus } from '../../../constants/TaskStatus';

const TaskStatusTag = ({ status }) => {
  switch (status) {
    case TaskStatus.draft:
      return (
        <Tag
          label="Rascunho"
          bgColor="gray"
          color="white"
          className="uppercase"
        />
      );

    case TaskStatus.finished:
      return (
        <Tag
          label="Finalizada"
          bgColor="success"
          color="white"
          className="uppercase"
        />
      );

    case TaskStatus.refused:
      return (
        <Tag
          label="Recusada"
          bgColor="error"
          color="white"
          className="uppercase"
        />
      );

    case TaskStatus.running:
      return (
        <Tag
          label="Aguardando"
          bgColor="cidOrangeLight"
          color="cidOrange"
          className="uppercase"
        />
      );

    case TaskStatus.started:
      return (
        <Tag
          label="Tramitando"
          bgColor="cidOrange"
          color="white"
          className="uppercase"
        />
      );

    default:
      return null;
  }
};

export default TaskStatusTag;
