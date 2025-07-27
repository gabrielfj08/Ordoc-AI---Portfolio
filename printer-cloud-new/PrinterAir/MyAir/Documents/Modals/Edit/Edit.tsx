import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Typography, Input, Button, TextArea } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../../hooks';
import { EditDocumentModalProps, EditDocumentFormValues } from './types';

const EditDocumentModal = ({
  onSubmit,
  description,
  location,
  originalFilename,
}: EditDocumentModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const path = require('path');

  const initialValues = {
    description: description,
    location: location,
    originalFilename: path.parse(originalFilename).name,
  };

  const extension = path.parse(originalFilename).ext;

  const formik = useFormik<EditDocumentFormValues>({
    initialValues,
    onSubmit: (values) => {
      const submitValuesDTO = {
        description: values.description,
        location: values.location,
        originalFilename: values.originalFilename.concat(extension),
      };
      onSubmit(submitValuesDTO)
        .then(() => {
          closeModal();
          showSnackbar(`Alterações salvas com sucesso.`, 'success');
        })
        .catch((error) => {
          if (error.response.status >= 400 && error.response.status < 500) {
            showSnackbar(error.response.data.message, 'error');
          } else {
            showSnackbar(
              'Oops, as alterações não foram salvas. Tente novamente mais tarde',
              'error'
            );
          }
        });
    },
    validationSchema: Yup.object().shape({
      originalFilename: Yup.string().required('Campo obrigatório'),
    }),
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Editar arquivo"
          color="blue"
          icon="write"
          stroke
          fill
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="overflow-hidden sm:w-auto w-72">
              <Typography variant="headline" family="robotoMedium">
                Nome do arquivo:
              </Typography>
            </div>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                name="originalFilename"
                onChange={formik.handleChange}
                value={formik.values.originalFilename}
              />
            </div>
            <div className="sm:hidden block">
              <Input
                size="md"
                w={72}
                type="text"
                name="originalFilename"
                onChange={formik.handleChange}
                value={formik.values.originalFilename}
              />
            </div>
            {formik.touched.originalFilename &&
            formik.errors.originalFilename ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.originalFilename}
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
            <Typography variant="headline" family="robotoMedium">
              Localização:
            </Typography>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                name="location"
                onChange={formik.handleChange}
                value={formik.values.location}
              />
            </div>
            <div className="sm:hidden block">
              <Input
                size="md"
                w={72}
                type="text"
                name="location"
                onChange={formik.handleChange}
                value={formik.values.location}
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
            label="Salvar alterações"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default EditDocumentModal;
