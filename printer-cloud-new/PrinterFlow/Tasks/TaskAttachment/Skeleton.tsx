import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const TaskAttachmentSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="overflow-hidden w-full">
        <Typography variant="footnote1" family="robotoMedium">
          Selecione os documentos do processo a serem mencionados:
        </Typography>
      </div>
      <Skeleton w="full" h={10} rounded="md" />
      <div className="overflow-hidden w-full">
        <Typography variant="footnote1" family="robotoMedium">
          Selecione os documentos da tarefa a serem mencionados:
        </Typography>
      </div>
      <Skeleton w="full" h={10} rounded="md" />
    </div>
  );
};
export default TaskAttachmentSkeleton;
