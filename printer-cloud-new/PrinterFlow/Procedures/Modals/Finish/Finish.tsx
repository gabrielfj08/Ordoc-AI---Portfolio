import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, TextArea, Button, Checkbox } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { FinishProcedureModalProps } from './types';

const FinishProcedureModal = ({
  onSubmit,
  processNumber,
}: FinishProcedureModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    checkbox: false,
  };

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Finalizar processo"
        color="blue"
        icon="proceduresV3"
        stroke
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit()
            .then(() => {
              closeModal();
              showSnackbar(`Processo finalizado com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
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
                    Está ação irá finalizar o processo:
                  </Typography>
                </div>
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  {processNumber}
                </Typography>
                <Typography variant="headline" family="roboto">
                  Está é uma ação irreversível. Ao clicar em finalizar processo,
                  ele será finalizado, impossibilitando qualquer tipo de ação.
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
                      Estou ciente que irei finalizar o processo.
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
              <Button
                type="button"
                onClick={closeModal}
                label="Cancelar"
                color="error"
              />
              <Button
                type="submit"
                color="info"
                label="Finalizar processo"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default FinishProcedureModal;
