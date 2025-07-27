import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Checkbox, Input, Typography } from 'printer-ui';
import { useDrawer, useModal } from '../../../../../hooks';
import { UploadDirectoryModalProps, UploadDirectoryFormValues } from './types';

const UploadDirectoryModal = ({ onSubmit }: UploadDirectoryModalProps) => {
  const { closeDrawer } = useDrawer();
  const { closeModal } = useModal();

  const initialValues = {
    description: '',
    location: '',
    fileList: null,
    skipOcr: false,
  };

  const formik = useFormik<UploadDirectoryFormValues>({
    initialValues,
    onSubmit: (values: UploadDirectoryFormValues) => {
      closeDrawer();
      closeModal();
      onSubmit(values);
    },
    validationSchema: Yup.object().shape({
      fileList: Yup.mixed().required('Selecione a pasta'),
    }),
  });

  return (
    <div>
      <ActionBox>
        <form onSubmit={formik.handleSubmit}>
          <ActionBox.Header
            title="Enviar pasta"
            color="blue"
            icon="folderOutlined"
            fill
            stroke
            onClose={closeModal}
          />
          <ActionBox.Content>
            <div className="w-[19rem] sm:w-[35.563rem]">
              <div className="flex flex-col space-y-4">
                <input
                  type="file"
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={(event) => {
                    formik.setFieldValue('fileList', event.currentTarget.files);
                  }}
                />
                {formik.touched.fileList && formik.errors.fileList && (
                  <Typography variant="footnote2" color="error">
                    <>* {formik.errors.fileList}</>
                  </Typography>
                )}
                <div className="flex flex-col space-y-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Descrição:
                  </Typography>
                  <Input
                    placeholder="Descrição"
                    name="description"
                    type="text"
                    w="full"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Typography variant="footnote1" family="robotoMedium">
                    Localização:
                  </Typography>
                  <Input
                    placeholder="Localização"
                    name="location"
                    type="text"
                    w="full"
                    onChange={formik.handleChange}
                    value={formik.values.location}
                  />
                </div>
                <div className="space-y-4">
                  <Typography variant="footnote2" color="darkGray">
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
                  <Typography variant="footnote2" color="darkGray">
                    <i>*Envio máximo de uma pasta por vez.</i>
                  </Typography>
                </div>
              </div>
            </div>
          </ActionBox.Content>
          <ActionBox.Footer>
            <Button
              label="Cancelar"
              color="error"
              onClick={closeModal}
              type="button"
            />
            <Button
              label="Enviar pasta"
              color="info"
              onClick={() => {}}
              type="submit"
              disabled={formik.isSubmitting}
            />
          </ActionBox.Footer>
        </form>
      </ActionBox>
    </div>
  );
};

export default UploadDirectoryModal;
