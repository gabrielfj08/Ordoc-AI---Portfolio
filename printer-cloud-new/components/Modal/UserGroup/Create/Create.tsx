import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Input, Button, Typography, TextArea } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useModal, useSnackbar } from '../../../../hooks';
import { CreateUserGroupModalProps } from './types';

const CreateUserGroupModal = ({ onSubmit }: CreateUserGroupModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      description: '',
      name: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Campo obrigatório')
        .matches(/^[^*]+$/, 'Nome não pode conter "*"')
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
    }),
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          closeModal();
          showSnackbar(`Grupo criado com sucesso.`, 'success');
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Adicionar novo grupo"
          color="blue"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-3">
            <div className="overflow-hidden sm:w-auto w-72">
              <Typography variant="headline" family="robotoMedium">
                Nome:
              </Typography>
            </div>
            <div className="sm:hidden block w-72">
              <Input
                size="md"
                w={72}
                type="text"
                id="name"
                name="name"
                placeholder=" "
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                id="name"
                name="name"
                placeholder=" "
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <Typography variant="footnote2" color="error">
                * {formik.errors.name}
              </Typography>
            )}
            <Typography variant="headline" family="robotoMedium">
              Descrição:
            </Typography>
            <div className="sm:hidden block">
              <TextArea
                name="description"
                className="px-5"
                cols={26}
                rows={2}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
            <div className="hidden sm:block w-72">
              <TextArea
                name="description"
                className="px-5"
                cols={57}
                rows={3}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
            {formik.touched.description && formik.errors.description && (
              <Typography variant="footnote2" color="error">
                * {formik.errors.description}
              </Typography>
            )}
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button onClick={closeModal} label="Cancelar" type="button" />
          <Button
            color="blue"
            type="submit"
            disabled={formik.isSubmitting}
            label="Adicionar grupo"
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default CreateUserGroupModal;
