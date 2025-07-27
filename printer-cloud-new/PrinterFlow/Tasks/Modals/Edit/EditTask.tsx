import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Button, Input, TextArea, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { noEmojiValidator } from '../../../../utils';
import { EditTaskModalProps, UpdateTaskFormValue } from './types';
import SelectPriority from '../SelectPriority';
import ShowTaskModalAppendices from '../Show/Appendices';
import TaskStatus from '../Show/Status';
import ShowTaskModal from '../Show';
import TaskAttachment from '../../TaskAttachment';
import TaskAttachmentList from '../../TaskAttachment/TaskAttachmentList';

const EditTaskModal = ({
  task,
  justificationModalVisibility,
  setJustificationModalVisibility,
  commentModalVisibility,
  setCommentModalVisibility,
  setAttachmentModalVisibility,
  attachmentModalVisibility,
  onSubmit,
}: EditTaskModalProps) => {
  const { showSnackbar } = useSnackbar();
  const { closeModal, openModal } = useModal();
  const formikRef = React.useRef<Formik>(null);

  const [isMentionVisible, setMentionVisibility] =
    React.useState<boolean>(false);

  const initialValues = {
    name: task.name,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
  } as UpdateTaskFormValue;

  return (
    <div className="sm:w-[569px]">
      <ActionBox>
        <ActionBox.Header
          title="Editar tarefa"
          color="blue"
          icon="tasksV3"
          stroke
          onClose={closeModal}
          className="sm:h-[66px]"
        />

        <div className="overflow-y-auto overflow-x-hidden sm:w-[569px] max-h-[480px]">
          <ActionBox.Content>
            <div className=" space-y-4">
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                  onSubmit(values)
                    .then(() => {
                      openModal(<ShowTaskModal taskId={task.id} />);
                      showSnackbar(
                        'Dados da tarefa atualizados com sucesso.',
                        'success'
                      );
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
                  name: Yup.string()
                    .required('Campo obrigatório')
                    .test(
                      'regex',
                      'Não utilize emojis (desenhos ou pictogramas).',
                      noEmojiValidator
                    ),
                  description: Yup.string()
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
                    <div className="space-y-2">
                      <Typography variant="footnote1" family="robotoMedium">
                        Nome da tarefa*:
                      </Typography>
                      <Input
                        w="full"
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <Typography variant="footnote2" color="error">
                          * {formik.errors.name}
                        </Typography>
                      ) : null}
                    </div>
                    <div className="space-y-3 mt-2">
                      <Typography variant="footnote1" family="robotoMedium">
                        Descrição*:
                      </Typography>
                      <div className="sm:hidden block">
                        <TextArea
                          name="description"
                          className="px-5"
                          cols={30}
                          rows={1}
                          onChange={formik.handleChange}
                          value={formik.values.description}
                        />
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <Typography variant="footnote2" color="error">
                            * {formik.errors.description}
                          </Typography>
                        ) : null}
                      </div>
                      <div className="hidden sm:block">
                        <TextArea
                          name="description"
                          className="px-5"
                          cols={50}
                          rows={2}
                          onChange={formik.handleChange}
                          value={formik.values.description}
                        />
                        {formik.touched.description &&
                        formik.errors.description ? (
                          <Typography variant="footnote2" color="error">
                            * {formik.errors.description}
                          </Typography>
                        ) : null}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2">
                      <div className="sm:space-y-6 space-y-2 min-h-[54px]">
                        <Typography variant="footnote1" family="robotoMedium">
                          Destino:
                        </Typography>
                        {task.groupAssignee ? (
                          <Typography variant="footnote1">
                            {task.groupAssignee?.name}
                          </Typography>
                        ) : (
                          <Typography
                            variant="footnote1"
                            className="italic"
                            color="gray"
                          >
                            Destino não definido
                          </Typography>
                        )}
                      </div>

                      <div className="space-y-2 min-h-[54px]">
                        <Typography variant="footnote1" family="robotoMedium">
                          Prazo:
                        </Typography>
                        <Input
                          w="full"
                          type="date"
                          name="deadline"
                          onChange={formik.handleChange}
                          value={formik.values.deadline}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 ">
                      <div className="space-y-2 min-h-[54px]">
                        <Typography variant="footnote1" family="robotoMedium">
                          Status:
                        </Typography>
                        <div className="flex flex-row items-center space-x-3">
                          <TaskStatus status="draft" />
                        </div>
                      </div>

                      <div className="space-y-3 mt-2 min-h-[40px]">
                        <Typography variant="footnote1" family="robotoMedium">
                          Prioridade
                        </Typography>
                        <SelectPriority name="priority" />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>

              <Typography
                variant="footnote2"
                family="roboto"
                color="gray"
                className="flex flex-col"
              >
                <b>Anexos:</b>
                <i>
                  Agora você pode anexar arquivos e também mencionar um arquivo
                  que já foi anexado anteriormente para evitar anexos
                  duplicados.
                </i>
              </Typography>

              <div>
                <div className="flex items-center justify-start">
                  <Button
                    className="border border-none"
                    label="Mencionar Arquivo"
                    color="info"
                    type="button"
                    outlined
                    onClick={() => {
                      setMentionVisibility(true);
                    }}
                  >
                    <Button.Icon
                      name="fileV3"
                      alt="file"
                      w={18}
                      h={18}
                      stroke
                    />
                  </Button>
                </div>

                {!isMentionVisible ? (
                  <TaskAttachmentList taskId={task.id} />
                ) : (
                  <div className=" flex items-center pt-2">
                    <TaskAttachment
                      taskStatus={task.status}
                      taskId={task.id}
                      setMentionVisibility={setMentionVisibility}
                    />
                  </div>
                )}
              </div>
            </div>
          </ActionBox.Content>
        </div>
        {isMentionVisible ? null : (
          <ActionBox.Footer>
            <Button
              type="button"
              color="error"
              label="Cancelar"
              onClick={() => openModal(<ShowTaskModal taskId={task.id} />)}
            />
            <Button
              type="button"
              color="info"
              label="Salvar alterações"
              disabled={formikRef.current?.isSubmitting}
              onClick={() => {
                formikRef.current?.submitForm();
              }}
            />
          </ActionBox.Footer>
        )}
      </ActionBox>
      <div className="mt-3">
        <ShowTaskModalAppendices
          task={task}
          status="draft"
          justificationModalVisibility={justificationModalVisibility}
          setJustificationModalVisibility={setJustificationModalVisibility}
          commentModalVisibility={commentModalVisibility}
          setAttachmentModalVisibility={setAttachmentModalVisibility}
          attachmentModalVisibility={attachmentModalVisibility}
          setCommentModalVisibility={setCommentModalVisibility}
        />
      </div>
    </div>
  );
};

export default EditTaskModal;
