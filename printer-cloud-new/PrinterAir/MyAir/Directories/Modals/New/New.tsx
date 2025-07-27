import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Typography, Input, Button, TextArea } from 'printer-ui';
import { useDrawer, useModal, useSnackbar } from '../../../../../hooks';
import { NewDirectoryModalProps, NewDirectoryFormValues } from './types';

const NewDirectoryModal = ({ onSubmit }: NewDirectoryModalProps) => {
  const { closeDrawer } = useDrawer();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: '',
    description: '',
  };

  const formik = useFormik<NewDirectoryFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          closeDrawer();
          closeModal();
          showSnackbar(`Pasta criada com sucesso.`, 'success');
        })
        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            showSnackbar(error.response.data.message, 'error');
          } else {
            showSnackbar(
              'Oops, a pasta não pode ser criada. Tente novamente mais tarde.',
              'error'
            );
          }
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required('Campo obrigatório')
        .matches(/^[^\/\*]+$/, 'Nome não pode conter / ou *'),
    }),
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Criar nova pasta"
          color="blue"
          icon="folderOutlined"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="overflow-hidden sm:w-auto w-72">
              <Typography variant="headline" family="robotoMedium">
                Nome da nova pasta:
              </Typography>
            </div>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="sm:hidden block">
              <Input
                size="md"
                w={72}
                type="text"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.name}
              </Typography>
            ) : null}
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
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button
            type="button"
            color="error"
            onClick={closeModal}
            label="Cancelar"
          />
          <Button
            type="submit"
            color="blue"
            label="Criar pasta"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default NewDirectoryModal;
