import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { queryClient } from '../../../../../../queryClient';
import {
  FileInput,
  ButtonV3 as Button,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useSession } from '../../../../../../hooks';
import { AddExternalAttachmentModalProps } from './types';
import AttachmentExternalUploadList from '../../../Attachment/NewAttachment/AttachmentUploadList';

const AddAttachmentTaskModal = ({
  task,
  setAttachmentModalVisibility,
}: AddExternalAttachmentModalProps) => {
  const { themeColor } = useSession();
  const [files, setFiles] = React.useState<FileList>();
  const [attachmentUploadListVisibility, setAttachmentUploadListVisibility] =
    React.useState<boolean>(false);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  return (
    <Formik
      initialValues={{ attachment: '' }}
      onSubmit={() => {}}
      validationSchema={Yup.object().shape({
        attachment: Yup.mixed().required(
          'Selecione ao menos um arquivo para envio.'
        ),
      })}
    >
      {(formik) => (
        <Form>
          <div className="w-full space-y-4">
            <FileInput
              multiple
              label="Selecione o anexo"
              styleColor={themeColor}
              name="attachment"
              value={formik.values.attachment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(e);
                setAttachmentUploadListVisibility(true);
                setIsUploading(true);
                setFiles(e.target.files as FileList);
              }}
            />
            {formik.touched.attachment && formik.errors.attachment ? (
              <Typography variant="bodyMd" color="error">
                * {formik.errors.attachment}
              </Typography>
            ) : null}
            <Typography variant="label" color="gray">
              Os arquivos anexados aparecerão abaixo. Isto pode demorar alguns
              instantes, dependendo do tamanho do arquivo.
            </Typography>
            <div className={attachmentUploadListVisibility ? 'flex' : 'hidden'}>
              <AttachmentExternalUploadList
                task={task}
                fileList={files as FileList}
                formik={formik}
                value={[] as Array<number>}
                fieldName="attachment"
                setIsUploading={setIsUploading}
              />
            </div>
            <div className="flex space-x-4 sm:justify-end justify-center mt-2">
              <Button
                w={60}
                size="sm"
                type="button"
                color={themeColor}
                style="outlined"
                label="Ver lista"
                disabled={isUploading}
                onClick={() => {
                  setAttachmentModalVisibility(false);
                  queryClient.invalidateQueries();
                }}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddAttachmentTaskModal;
