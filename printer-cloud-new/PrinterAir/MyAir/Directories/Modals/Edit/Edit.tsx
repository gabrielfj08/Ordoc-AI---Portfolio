import * as React from 'react';
import { useFormik } from 'formik';
import { ActionBox, Typography, Input, Button, TextArea } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../../hooks';
import { EditDirectoryModalProps, EditDirectoryFormValues } from './types';

const EditDirectoryModal = ({
  onSubmit,
  name,
  description,
}: EditDirectoryModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    description: description,
  };

  const formik = useFormik<EditDirectoryFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
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
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Editar pasta"
          color="blue"
          icon="write"
          stroke
          fill
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <div className="overflow-hidden sm:w-auto w-72">
              <Typography variant="headline" family="robotoMedium" color="gray">
                Nome da pasta:
              </Typography>
            </div>
            <div className="hidden sm:block">
              <Input
                w="full"
                type="text"
                name="name"
                onChange={() => null}
                value={name}
                disabled
              />
            </div>
            <div className="sm:hidden block">
              <Input
                size="md"
                w={72}
                type="text"
                name="name"
                onChange={() => null}
                value={name}
                disabled
              />
            </div>
            <Typography variant="footnote2" color="gray" className="italic">
              * Nome de pasta não pode ser alterada
            </Typography>
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
            label="Salvar alterações"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default EditDirectoryModal;
