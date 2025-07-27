import * as React from 'react';
import { Formik, Form } from 'formik';
import { ActionBox, Typography, Button, Item } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { AddRequestersModalProps, AddRequestersFormValues } from './types';
import AddRequestersSelect from './Select';

const AddRequestersModal = ({ groupId, onSubmit }: AddRequestersModalProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={
        {
          requesterIds: [],
        } as AddRequestersFormValues
      }
      onSubmit={(values: AddRequestersFormValues, actions) => {
        onSubmit(values)
          .then(() => {
            closeModal();
            showSnackbar(
              'Solicitante(s) adicionado(s) com sucesso.',
              'success'
            );
          })
          .catch((error) => {
            if (error.response.status >= 400 && error.response.status < 500) {
              showSnackbar(error.response.data.message, 'error');
            } else {
              showSnackbar(
                'O solicitante não pode ser adicionado. Tente novamente mais tarde.',
                'error'
              );
            }
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
    >
      {(formik) => (
        <Form>
          <ActionBox className="max-w-full">
            <ActionBox.Header
              title="Adicionar novo solicitante"
              color="blue"
              icon="requesterV3"
              fill
              onClose={closeModal}
            />
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-4">
                <div className="overflow-hidden sm:w-auto w-72">
                  <Typography variant="headline" family="robotoMedium">
                    Selecione o solicitante desejado:
                  </Typography>
                </div>
                <AddRequestersSelect name="requesterIds" groupId={groupId} />
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
                label="Adicionar solicitante"
                className="-mr-2 sm:mr-0"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </ActionBox>
        </Form>
      )}
    </Formik>
  );
};

export default AddRequestersModal;
