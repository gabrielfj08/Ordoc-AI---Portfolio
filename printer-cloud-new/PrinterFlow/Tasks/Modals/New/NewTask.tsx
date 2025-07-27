import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { ActionBox, Button, Input, TextArea, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSnackbar } from '../../../../hooks';
import { NewTaskFormValues, NewTaskModalProps } from './types';

const NewTaskModal = ({ onSubmit }: NewTaskModalProps) => {
  const { showSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const initialValues = {
    name: '',
    description: '',
    procedureId: Number(router.query.procedureId),
  } as NewTaskFormValues;

  return (
    <ActionBox>
      <ActionBox.Header
        title="Nova tarefa"
        color="blue"
        icon="tasksV3"
        stroke
        onClose={closeModal}
        className="sm:h-[66px]"
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showSnackbar('Nova tarefa criada com sucesso', 'success');
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
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-3">
                <div className="overflow-hidden sm-w-96 w-72">
                  <Typography variant="footnote1" family="robotoMedium">
                    Nome da tarefa*:
                  </Typography>
                </div>
                <div className="hidden sm:block">
                  <Input
                    w="full"
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    placeholder="Nome"
                  />
                </div>
                <div className="sm:hidden block">
                  <Input
                    size="md"
                    w="full"
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    placeholder="Nome"
                  />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.name}
                  </Typography>
                ) : null}
                <Typography variant="footnote1" family="robotoMedium">
                  Descrição*:
                </Typography>
                <div className="sm:hidden block">
                  <TextArea
                    size="md"
                    name="description"
                    className="px-5"
                    cols={27}
                    rows={3}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    placeholder="Descrição"
                  />
                </div>
                <div className="hidden sm:block w-full">
                  <TextArea
                    name="description"
                    className="px-5"
                    cols={56}
                    rows={3}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    placeholder="Descrição"
                  />
                </div>
                {formik.touched.description && formik.errors.description ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.description}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                type="button"
                color="error"
                label="Cancelar"
                onClick={closeModal}
              />
              <Button
                type="submit"
                color="info"
                label="Criar tarefa"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default NewTaskModal;
