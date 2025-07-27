import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Checkbox, Input, Typography } from 'printer-ui';
import { useDrawer, useModal } from '../../../../../hooks';
import { UploadDocumentsModalProps, UploadDocumentsFormValues } from './types';

const UploadDocumentsModal = ({ onSubmit }: UploadDocumentsModalProps) => {
  const { closeDrawer } = useDrawer();
  const { closeModal } = useModal();

  const initialValues = {
    description: '',
    location: '',
    fileList: null,
    skipOcr: false,
  };

  const formik = useFormik<UploadDocumentsFormValues>({
    initialValues,
    onSubmit: (values: UploadDocumentsFormValues) => {
      closeDrawer();
      closeModal();
      onSubmit(values);
    },
    validationSchema: Yup.object().shape({
      fileList: Yup.mixed().required('Selecione os arquivos'),
    }),
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Enviar arquivos"
          color="blue"
          icon="pdfFileV2"
          fill
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="overflow-hidden sm:w-auto w-72">
              <div className="mb-2">
                <input
                  type="file"
                  name="fileList"
                  onChange={(event) => {
                    formik.setFieldValue('fileList', event.currentTarget.files);
                  }}
                  multiple
                />
                {formik.touched.fileList && formik.errors.fileList && (
                  <Typography variant="footnote2" color="error">
                    <>* {formik.errors.fileList}</>
                  </Typography>
                )}
              </div>
              <div>
                <div className="mb-2">
                  <Typography variant="headline" family="robotoMedium">
                    Descrição dos arquivos:
                  </Typography>
                  <div className="hidden sm:block">
                    <Input
                      w="full"
                      type="text"
                      name="description"
                      onChange={formik.handleChange}
                      value={formik.values.description}
                    />
                  </div>
                  <div className="sm:hidden block">
                    <Input
                      size="md"
                      w={72}
                      type="text"
                      name="description"
                      onChange={formik.handleChange}
                      value={formik.values.description}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <Typography variant="headline" family="robotoMedium">
                    Localização dos arquivos:
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
                <Typography
                  variant="footnote2"
                  color="darkGray"
                  className="mb-3"
                >
                  <i>
                    *Todos os arquivos em PDF e imagens serão processados via
                    OCR por padrão, caso deseje preservar a versão original,
                    marque a opção abaixo.
                  </i>
                </Typography>
                <div className="flex gap-2">
                  <Checkbox
                    id="skipOcr"
                    name="skipOcr"
                    onChange={formik.handleChange}
                    checked={formik.values.skipOcr}
                  />
                  <label htmlFor="skipOcr" className="cursor-pointer">
                    <Typography variant="footnote1">
                      Não realizar OCR
                    </Typography>
                  </label>
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
            disabled={false} // TODO: USE FORMIK SUBMISSION STATE TO SET LOADING STATUS
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default UploadDocumentsModal;
