import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, Button, Checkbox } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { RemoveRequesterModalProps } from './types';

const RemoveRequesterModal = ({
  onSubmit,
  groupName,
  requesterName,
}: RemoveRequesterModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    checkbox: false,
  };

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Remover solicitante do grupo"
        color="error"
        icon="requester"
        stroke
        fill
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit()
            .then(() => {
              closeModal();
              showSnackbar(`Solicitante removido com sucesso.`, 'success');
            })
            .catch((error) => {
              if (error.response.status >= 400 && error.response.status < 500) {
                showSnackbar(error.response.data.message, 'error');
              } else {
                showSnackbar(
                  'O solicitante não pôde ser removido, tente novamente mais tarde.',
                  'error'
                );
              }
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-4">
                <div className="overflow-hidden sm:w-auto w-72">
                  <Typography variant="headline" family="roboto">
                    Está ciente que esta ação irá remover o solicitante abaixo?
                  </Typography>
                </div>
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  {requesterName}
                </Typography>
                <Typography variant="headline" family="roboto">
                  Ao clicar em remover solicitante, ele será removido do grupo
                  abaixo:
                </Typography>
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  {groupName}
                </Typography>
                <span className="flex space-x-2 justify-start items-center pt-2">
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                  />
                  <label htmlFor="checkbox" className="cursor-pointer">
                    <Typography variant="headline" family="roboto">
                      Estou ciente que irei remover o solicitante.
                    </Typography>
                  </label>
                </span>
                {formik.errors.checkbox ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button type="button" onClick={closeModal} label="Cancelar" />
              <Button
                type="submit"
                color="error"
                label="Remover solicitante"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default RemoveRequesterModal;
