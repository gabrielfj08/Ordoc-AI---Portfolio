import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { queryClient } from '../../../../../queryClient';
import {
  ButtonV3 as Button,
  Icon,
  TextAreaV3 as TextArea,
  TypographyV3 as Typography,
} from 'printer-ui';
import {
  useAuth,
  useExternalAuth,
  useExternalSession,
  useSession,
  useV3Snackbar,
} from '../../../../../hooks';
import { noEmojiValidator } from '../../../../../utils';
import { ExternalTaskCommentService } from '../../../../../services/flow-cidadao';
import { TaskExtenalCommentItemProps } from './types';

const TaskExtenalCommentItem = ({
  type,
  task,
  setType,
  onSubmit,
  createdBy,
  taskComments,
}: TaskExtenalCommentItemProps) => {
  const { externalSession } = useExternalSession();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { themeColor } = useSession();
  const { subdomain } = useAuth();

  const initialValues = {
    body: taskComments.body,
  };

  const actionsExternalTaskComments: any = {
    show: (
      <div className="items-center justify-center flex">
        <div
          className={`w-full h-24 overflow-y-auto px-4 py-2 border border-${themeColor} rounded-lg space-y-1 mb-4`}
        >
          <Typography
            variant="bodyMd"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Comentário:
          </Typography>
          <Typography
            variant="label"
            family="jakartaBold"
            color="darkGray"
            className="flex"
          >
            Atualizado em {''}
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
            }).format(
              new Date(
                new Date(taskComments.updatedAt)
                  .toISOString()
                  .replace('.000Z', '')
              )
            )}{' '}
            por {createdBy}
          </Typography>
          <Typography
            variant="bodyMd"
            family="jakarta"
            color="darkGray"
            align="start"
          >
            {taskComments.body}
          </Typography>
        </div>
        <div
          className={`${
            externalSession?.user?.id !== taskComments.createdById
              ? 'hidden'
              : 'flex'
          }`}
        >
          {task.status === 'started' ? (
            <div className="w-10 h-24 items-center justify-center flex flex-col mb-4 space-y-2 mx-2">
              <button
                type="button"
                disabled={taskComments?.id ? false : true}
                onClick={() => {
                  setType('edit');
                }}
              >
                <div className="items-center grid justify-center">
                  <Icon
                    alt="write"
                    name="write"
                    stroke
                    fill
                    color={themeColor}
                    w={25}
                    h={25}
                  />
                  <Typography
                    variant="label"
                    family="jakartaBold"
                    color={themeColor}
                  >
                    Editar
                  </Typography>
                </div>
              </button>
              <button
                type="submit"
                disabled={taskComments?.id ? false : true}
                onClick={() =>
                  ExternalTaskCommentService.deleteComment(
                    String(externalToken),
                    subdomain,
                    taskComments.taskId,
                    taskComments.id
                  )
                    .then(() => {
                      showV3Snackbar(
                        `Comentário excluído com sucesso.`,
                        'success',
                        'Sucesso!'
                      );
                      queryClient.invalidateQueries();
                    })
                    .catch((error) => {
                      showV3Snackbar(
                        error.response.data.message,
                        'error',
                        'Algo deu errado!'
                      );
                    })
                }
              >
                <Icon
                  alt="circleClose"
                  name="circleClose"
                  stroke
                  color={themeColor}
                  w={23}
                  h={23}
                  className="ml-1"
                />
                <Typography
                  variant="label"
                  family="jakartaBold"
                  color={themeColor}
                >
                  Excluir
                </Typography>
              </button>
            </div>
          ) : null}
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
              showV3Snackbar(
                'Comentário editado com sucesso.',
                'success',
                'Sucesso!'
              );
            })
            .catch((error) => {
              showV3Snackbar(
                error.response.data.message,
                'error',
                'Algo deu errado!'
              );
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
            <div className="w-full sm:pr-3 mb-2">
              <TextArea
                name="body"
                w="full"
                rows={4}
                label="Editar comentário"
                color={themeColor}
                value={formik.values.body}
                onChange={formik.handleChange}
              />
              {formik.touched.body && formik.errors.body ? (
                <Typography variant="label" color="error">
                  * {formik.errors.body}
                </Typography>
              ) : null}
            </div>
            <div
              key={taskComments.id}
              className="w-full flex space-x-4 sm:justify-end justify-center mb-4 sm:pr-3"
            >
              <Button
                w="full"
                size="sm"
                type="submit"
                label="Salvar"
                color={themeColor}
                className="sm:w-60"
                disabled={!formik.values.body || formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    ),
  };

  return <div>{actionsExternalTaskComments[type]}</div>;
};

export default TaskExtenalCommentItem;
