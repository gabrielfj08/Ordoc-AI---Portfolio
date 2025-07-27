import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { AddAttachmentModalProps } from './types';

const AddAttachmentsModal = ({ onSubmit }: AddAttachmentModalProps) => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <Formik
        initialValues={{ fileList: null }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          fileList: Yup.mixed().required(
            'Selecione ao menos um arquivo para envio.'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <>
              <ActionBox.Header
                title="Anexar arquivo(s)"
                color="blue"
                onClose={closeModal}
              />
              <ActionBox.Content>
                <div className="overflow-hidden sm:w-96 w-72">
                  <input
                    className="font-roboto-400 truncate"
                    type="file"
                    name="fileList"
                    onChange={(event) => {
                      formik.setFieldValue(
                        'fileList',
                        event.currentTarget.files
                      );
                    }}
                    multiple
                  />
                </div>
                <div className="mt-2">
                  {formik.touched.fileList && formik.errors.fileList ? (
                    <Typography variant="footnote2" color="error">
                      * {formik.errors.fileList}
                    </Typography>
                  ) : null}
                </div>
              </ActionBox.Content>
              <ActionBox.Footer>
                <Button
                  label="Cancelar"
                  color="error"
                  type="button"
                  onClick={closeModal}
                />
                <Button label="Enviar" color="info" type="submit" />
              </ActionBox.Footer>
            </>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default AddAttachmentsModal;
