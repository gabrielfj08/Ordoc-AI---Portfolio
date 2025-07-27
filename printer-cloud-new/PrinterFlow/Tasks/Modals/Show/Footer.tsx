import * as React from 'react';
import { ActionBox, Button, Icon } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { TaskService } from '../../../../services/printer-flow';
import { queryClient } from '../../../../queryClient';
import { ModalShowButtonsProps } from './types';
import EditTaskModal from '../Edit';

const ModalShowButtons = ({
  task,
  justificationModalVisibility,
  setJustificationModalVisibility,
  commentModalVisibility,
  setCommentModalVisibility,
  setAttachmentModalVisibility,
  attachmentModalVisibility,
}: ModalShowButtonsProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { openModal, closeModal } = useModal();

  switch (task.status) {
    case 'draft':
      return (
        <ActionBox.Footer>
          <Button
            color="error"
            label="Excluir tarefa"
            onClick={() => {
              TaskService.deleteTask(token, subdomain, task.id)
                .then(() => {
                  showSnackbar('Tarefa excluída com sucesso.', 'success');
                  queryClient.invalidateQueries([
                    'tasks',
                    subdomain,
                    token,
                    {},
                  ]);
                  closeModal();
                })
                .catch((err) =>
                  showSnackbar(err.response.data.message, 'error')
                );
            }}
          />
          <Button
            type="button"
            color="info"
            label="Editar tarefa"
            onClick={() =>
              openModal(
                <EditTaskModal
                  task={task}
                  justificationModalVisibility={justificationModalVisibility}
                  setJustificationModalVisibility={
                    setJustificationModalVisibility
                  }
                  commentModalVisibility={commentModalVisibility}
                  setCommentModalVisibility={setCommentModalVisibility}
                  attachmentModalVisibility={attachmentModalVisibility}
                  setAttachmentModalVisibility={setAttachmentModalVisibility}
                />
              )
            }
          />
        </ActionBox.Footer>
      );
    case 'running':
      return (
        <ActionBox.Footer>
          <Button
            color="error"
            label="Recusar tarefa"
            onClick={() => setJustificationModalVisibility(true)}
          />
          <Button
            color="info"
            label="Aceitar tarefa"
            onClick={() => {
              TaskService.accept(token, subdomain, task.id)
                .then(() => {
                  showSnackbar('Tarefa aceita com sucesso.', 'success');
                  queryClient.invalidateQueries([
                    'task',
                    token,
                    subdomain,
                    task.id,
                  ]);
                  queryClient.invalidateQueries(['tasks', subdomain, token]);
                  queryClient.invalidateQueries([
                    'tasksRunning',
                    subdomain,
                    token,
                    {},
                  ]);
                  queryClient.invalidateQueries([
                    'tasksStarted',
                    subdomain,
                    token,
                    {},
                  ]);
                  queryClient.invalidateQueries([]);
                })
                .catch((err) =>
                  showSnackbar(err.response.data.message, 'error')
                );
            }}
          />
        </ActionBox.Footer>
      );
    case 'started':
      return (
        <ActionBox.Footer>
          <Button
            color="success"
            label="Finalizar tarefa"
            onClick={() => {
              TaskService.finish(token, subdomain, task.id)
                .then(() => {
                  showSnackbar('Tarefa finalizada com sucesso.', 'success');
                  queryClient.invalidateQueries([
                    'task',
                    token,
                    subdomain,
                    task.id,
                  ]);
                  queryClient.invalidateQueries(['tasks', subdomain, token]);
                  queryClient.invalidateQueries([
                    'tasksRunning',
                    subdomain,
                    token,
                    {},
                  ]);
                  queryClient.invalidateQueries([
                    'tasksStarted',
                    subdomain,
                    token,
                    {},
                  ]);
                })
                .catch((err) =>
                  showSnackbar(err.response.data.message, 'error')
                );
            }}
          />
          <div className="sm:flex sm:items-right sm:space-x-3 sm:space-y-0 space-y-2">
            <Button
              onClick={() => {
                setAttachmentModalVisibility(true);
                setCommentModalVisibility(false);
              }}
              color="info"
              label="Documento"
              className="sm:px-4 px-9"
            >
              <Icon
                alt="maisDocumento"
                name="plus"
                color="white"
                fill
                stroke
                w={25}
                h={25}
              />
            </Button>
            <Button
              onClick={() => {
                setCommentModalVisibility(true);
                setAttachmentModalVisibility(false);
              }}
              color="info"
              label="Comentário"
              className="sm:px-4 "
            >
              <Icon
                alt="maisComentario"
                name="plus"
                color="white"
                fill
                stroke
                w={25}
                h={25}
              />
            </Button>
          </div>
        </ActionBox.Footer>
      );
    case 'refused':
      return null;
    case 'finished':
      return null;
    default:
      return null;
  }
};

export default ModalShowButtons;
