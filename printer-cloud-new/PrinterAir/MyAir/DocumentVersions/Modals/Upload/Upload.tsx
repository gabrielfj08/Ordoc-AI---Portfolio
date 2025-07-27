import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import {
  UploadDocumentVersionsModalProps,
  UploadDocumentVersionsModalFormValues,
} from './types';
import DocumentVersion from '../..';

const UploadDocumentVersionsModal = ({
  onSubmit,
  document,
}: UploadDocumentVersionsModalProps) => {
  const { closeModal } = useModal();

  const initialValues: UploadDocumentVersionsModalFormValues = {
    description: '',
    location: '',
    file: null,
  };

  return (
    <ActionBox>
      <ActionBox.Header
        title="Gerenciar versões"
        color="blue"
        icon="versionsV2"
        fill
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          closeModal();
          onSubmit(values);
        }}
        validationSchema={Yup.object().shape({
          file: Yup.mixed().required('Selecione os arquivos'),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-2">
                <div className="overflow-hidden sm:w-auto">
                  <Typography variant="headline" family="robotoMedium">
                    Enviar nova versão:
                  </Typography>
                  <input
                    className="py-2"
                    type="file"
                    name="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        'file',
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.file}
                    </Typography>
                  )}
                  <Typography
                    variant="headline"
                    family="robotoMedium"
                    className="pb-2"
                  >
                    Histórico de atualizações:
                  </Typography>
                  <div className="py-2 h-80 overflow-y-auto">
                    <div className="space-y-4">
                      <DocumentVersion document={document} />
                    </div>
                  </div>
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
                label="Enviar arquivos"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default UploadDocumentVersionsModal;
