import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, TextArea, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useAuth, useSnackbar } from '../../../../hooks';
import { TaskCommentService } from '../../../../services/printer-flow';
import { EditTaskCommentFormValues, TaskCommentListProps } from './types';

const TaskCommentItem = ({
  taskComments,
  type,
  onSubmit,
  setType,
}: TaskCommentListProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const initialValues = {
    body: taskComments.body,
  } as EditTaskCommentFormValues;

  const actionsTaskComments: any = {
    show: (
      <div className="w-full space-y-2 pr-1">
        <div className="flex">
          <div
            key={taskComments.id}
            className="items-center flex bg-lighterGray rounded-lg p-4
          justify-between w-full mr-2"
          >
            <Typography variant="footnote1">{taskComments.body}</Typography>
          </div>
          <div className="grid items-center">
            <div
              id={`updateComment-${taskComments?.id}`}
              data-tooltip-content="Editar comentário"
            >
              <button
                type="button"
                disabled={taskComments?.id ? false : true}
                onClick={() => {
                  setType('edit');
                }}
              >
                <Icon
                  alt="write"
                  name="write"
                  stroke
                  fill
                  color="blue"
                  w={28}
                  h={28}
                />
              </button>
              <ReactTooltip anchorId={`updateComment-${taskComments?.id}`} />
            </div>
          </div>
        </div>
      </div>
    ),
    edit: (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              setType('show');
              showSnackbar('Comentário editado com sucesso.', 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          body: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
        })}
      >
        {(formik) => (
          <Form>
            <div className="w-full flex">
              <div className="sm:hidden block">
                <TextArea
                  name="body"
                  className="px-5"
                  cols={28}
                  rows={3}
                  onChange={formik.handleChange}
                  value={formik.values.body}
                />
                {formik.touched.body && formik.errors.body ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.body as string}
                  </Typography>
                ) : null}
              </div>
              <div className="hidden sm:block">
                <TextArea
                  name="body"
                  className="px-5"
                  cols={43}
                  rows={3}
                  onChange={formik.handleChange}
                  value={formik.values.body}
                />
                {formik.touched.body && formik.errors.body ? (
                  <Typography variant="footnote2" color="error">
                    *{formik.errors.body as string}
                  </Typography>
                ) : null}
              </div>

              <div key={taskComments.id} className="grid items-center p-2">
                <div
                  id={`removeComment-${taskComments?.id}`}
                  data-tooltip-content="Excluir comentário"
                >
                  <button
                    className="w-7 h-7 flex items-center justify-center"
                    type="button"
                    disabled={taskComments?.id ? false : true}
                    onClick={() =>
                      TaskCommentService.deleteComment(
                        token,
                        subdomain,
                        taskComments.taskId,
                        taskComments.id
                      )
                        .then(() => {
                          showSnackbar(
                            `Comentário excluído com sucesso.`,
                            'success'
                          );
                          queryClient.invalidateQueries([
                            'taskComments',
                            token,
                            subdomain,
                            taskComments.taskId,
                          ]);
                        })
                        .catch((error) => {
                          showSnackbar(error.response.data.message, 'error');
                        })
                    }
                  >
                    <Icon
                      alt="trash"
                      name="trashV2"
                      stroke
                      fill
                      color="error"
                      w={30}
                      h={30}
                    />
                  </button>
                  <ReactTooltip
                    anchorId={`removeComment-${taskComments?.id}`}
                  />
                </div>
                <div
                  id={`saveComment-${taskComments?.id}`}
                  data-tooltip-content="Salvar alterações"
                >
                  <button
                    className="w-7 h-7 rounded-full bg-info flex items-center justify-center"
                    type="submit"
                    disabled={taskComments?.id ? false : true}
                  >
                    <Icon
                      alt="check"
                      name="check"
                      color="white"
                      fill
                      stroke
                      w={25}
                      h={25}
                    />
                  </button>
                  <ReactTooltip anchorId={`saveComment-${taskComments?.id}`} />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    ),
  };

  return <div>{actionsTaskComments[type]}</div>;
};

export default TaskCommentItem;
