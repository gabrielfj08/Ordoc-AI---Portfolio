import * as React from 'react';
import getConfig from 'next/config';
import { Icon, Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../utils';
import { TaskAttachmentItemProps } from './types';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const TaskAttachmentItem = ({
  taskAttachment,
  handleSubmit,
}: TaskAttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center mt-2">
      <div
        className="flex items-center bg-lighterGray rounded-lg px-4 py-2
     truncate w-full"
        onClick={() =>
          window.document.open(
            `${apiUrl}/${taskAttachment.attachable.documentUrl}`,
            '_blank',
            'noreferrer'
          )
        }
      >
        <div className="flex items-center space-x-2 w-full truncate cursor-pointer">
          <Icon name="fileV2" alt="file" fill w={30} h={30} />
          <Typography variant="footnote1" className="w-full truncate">
            {removeFileExtension(taskAttachment.attachable.name)}
          </Typography>
        </div>
        <Icon
          name="eye"
          alt="eye"
          w={30}
          h={30}
          fill
          className="cursor-pointer"
        />
      </div>
      <div className="px-[5px] cursor-pointer" onClick={handleSubmit}>
        <Icon name="trashV2" alt="trash" w={30} h={30} fill color="error" />
      </div>
    </div>
  );
};

export default TaskAttachmentItem;
