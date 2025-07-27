import * as React from 'react';
import { Button, Input, TextArea, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../../../../hooks';
import { EditDocumentInfoFormProps, EditDocumentInfoFormValues } from './types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const EditDocumentInfoForm = ({
  onClose,
  document,
  onSubmit,
}: EditDocumentInfoFormProps) => {
  const path = require('path');
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    originalFilename: path.parse(document.originalFilename).name,
    location: document.location,
    description: document.description,
  };

  const extension = path.parse(document.originalFilename).ext;

  const formik = useFormik<EditDocumentInfoFormValues>({
    initialValues,
    validationSchema: Yup.object().shape({
      originalFilename: Yup.string().required('Campo obrigatório'),
    }),
    onSubmit: (values) => {
      const submitValuesDTO = {
        originalFilename: values.originalFilename.concat(extension),
        location: values.location,
        description: values.description,
      };

      onSubmit(submitValuesDTO)
        .then(() => {
          onClose();
          showSnackbar('Alterações salvas com sucesso', 'success');
        })
        .catch((error) => {
          formik.setSubmitting(false);
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
  });

  return (
    <form
      className="w-full flex flex-col lg:flex-row gap-3 lg:gap-10 lg:justify-between"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col gap-2 grow">
        <label htmlFor="originalFilename">
          <Typography variant="headline" family="robotoMedium">
            Nome do arquivo:
          </Typography>
          <Input
            id="originalFilename"
            w="full"
            value={formik.values.originalFilename}
            onChange={formik.handleChange}
          />
          {formik.touched.originalFilename && formik.errors.originalFilename ? (
            <Typography variant="footnote2" color="error" className="mt-1">
              * {formik.errors.originalFilename}
            </Typography>
          ) : null}
        </label>
        <label htmlFor="location">
          <Typography variant="headline" family="robotoMedium">
            Localização:
          </Typography>
          <Input
            id="location"
            w="full"
            value={formik.values.location}
            onChange={formik.handleChange}
          />
        </label>
      </div>
      <label htmlFor="description" className="grow">
        <Typography variant="headline" family="robotoMedium">
          Descrição:
        </Typography>
        <TextArea
          name="description"
          className="w-full px-5 py-4"
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
        />
      </label>
      <div className="flex gap-2 lg:gap-6 justify-between lg:justify-end lg:flex-col-reverse">
        <Button
          label="Cancelar"
          color="error"
          type="button"
          onClick={onClose}
        />
        <Button
          label="Salvar alterações"
          color="blue"
          type="submit"
          className="lg:mt-6"
          disabled={formik.isSubmitting}
        />
      </div>
    </form>
  );
};

export default EditDocumentInfoForm;
