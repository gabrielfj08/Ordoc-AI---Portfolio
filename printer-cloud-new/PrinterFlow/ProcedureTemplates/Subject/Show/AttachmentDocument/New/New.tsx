import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useDrawer, useModal } from '../../../../../../hooks';
import { ActionBox, Button, Typography } from 'printer-ui';
import {
  NewSubjectDocumentFormValues,
  NewSubjectDocumentModalProps,
} from './types';

const NewSubjectDocumentModal = ({
  onSubmit,
}: NewSubjectDocumentModalProps) => {
  const { closeModal } = useModal();
  const { closeDrawer } = useDrawer();

  const initialValues = {
    fileList: null,
  };

  return (
    <ActionBox>
      <ActionBox.Header
        color="blue"
        title="Adicionar anexos"
        icon="fileV2"
        fill
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values: NewSubjectDocumentFormValues) => {
          onSubmit(values);
          closeDrawer(), closeModal();
        }}
        validationSchema={Yup.object().shape({
          fileList: Yup.mixed().required('Selecione os arquivos'),
        })}
      >
        {(formik) => (
          <Form>
            <>
              <ActionBox.Content>
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
              </ActionBox.Content>
              <ActionBox.Footer>
                <Button
                  type="button"
                  label="Cancelar"
                  color="error"
                  onClick={closeModal}
                />
                <Button
                  label="Adicionar"
                  color="info"
                  type="submit"
                  disabled={formik.isSubmitting}
                />
              </ActionBox.Footer>
            </>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default NewSubjectDocumentModal;
