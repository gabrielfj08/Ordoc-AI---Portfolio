import * as React from 'react';
import { ButtonV3 as Button } from 'printer-ui';
import { useSession } from '../../../../../../hooks';
import { ShowExternalButtonsModalProps } from '../../types';

const ShowExternalButtonsModal = ({
  task,
  acceptTaskHandleSubmit,
  finishTaskHandleSubmit,
  justificationModalVisibility,
  setJustificationModalVisibility,
}: ShowExternalButtonsModalProps) => {
  const { themeColor } = useSession();

  switch (task.status) {
    case 'running':
      return (
        <div
          className={`${
            justificationModalVisibility ? 'hidden' : 'block'
          } flex space-x-4 sm:justify-end justify-center`}
        >
          <Button
            w={60}
            type="button"
            label="Recusar"
            color={themeColor}
            style="outlined"
            onClick={() => setJustificationModalVisibility(true)}
          />
          <Button
            w={60}
            type="submit"
            label="Aceitar"
            color={themeColor}
            onClick={(task) => {
              acceptTaskHandleSubmit(task);
            }}
          />
        </div>
      );

    case 'started':
      return (
        <div className="w-full flex space-x-4 justify-center">
          <Button
            w="full"
            color={themeColor}
            label="Finalizar tarefa"
            className="sm:w-60"
            onClick={(task) => {
              finishTaskHandleSubmit(task);
            }}
          />
        </div>
      );
    case 'refused':
      return null;
    case 'finished':
      return null;
    default:
      return null;
  }
};

export default ShowExternalButtonsModal;
