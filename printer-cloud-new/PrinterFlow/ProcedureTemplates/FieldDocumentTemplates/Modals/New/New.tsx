import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, Input, Button } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../../hooks';
import {
  NewFieldDocumentTemplateModalProps,
  NewFieldDocumentTemplateFormValues,
} from './types';

const NewFieldDocumentTemplateModal = ({
  onSubmit,
}: NewFieldDocumentTemplateModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: '',
    fileList: null,
  };

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Novo modelo de anexo"
        color="blue"
        icon="fileV2"
        fill
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values: NewFieldDocumentTemplateFormValues) => {
          onSubmit(values);
          closeModal();
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Campo obrigatório'),
          fileList: Yup.mixed().required('Selecione o anexo'),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-4">
                <div className="overflow-hidden sm:w-auto w-72">
                  <Typography variant="headline" family="roboto">
                    Selecione o modelo de anexo:
                  </Typography>
                </div>
                <input
                  type="file"
                  name="fileList"
                  onChange={(event) => {
                    formik.setFieldValue('fileList', event.currentTarget.files);
                  }}
                />
                {formik.touched.fileList && formik.errors.fileList && (
                  <Typography variant="footnote2" color="error">
                    <>* {formik.errors.fileList}</>
                  </Typography>
                )}
                <Typography variant="headline" family="robotoMedium">
                  Nome do modelo de anexo:
                </Typography>
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
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                type="button"
                onClick={closeModal}
                label="Cancelar"
                color="error"
              />
              <Button
                type="submit"
                color="blue"
                label="Salvar modelo"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default NewFieldDocumentTemplateModal;
