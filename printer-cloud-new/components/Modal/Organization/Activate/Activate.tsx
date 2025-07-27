import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { OrganizationService } from '../../../../services';
import { OrganizationModalProps } from '../types';

const Activate = ({ id, name }: OrganizationModalProps) => {
  const { token } = useAuth();

  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      checkbox: false,
    },
    validationSchema: Yup.object().shape({
      checkbox: Yup.bool().oneOf(
        [true],
        'Marque a caixa acima para prosseguir'
      ),
    }),
    onSubmit: () => {
      OrganizationService.activate(id, token)
        .then(() => {
          closeModal();
          showSnackbar(
            `A instituição ${name} foi ativada com sucesso.`,
            'success'
          );
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Ativar instituição no sistema"
          color="success"
          icon="institution"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-1">
            <Typography variant="footnote1">
              Você tem certeza da sua ação?
            </Typography>
            <Typography variant="footnote1" className="pt-4 pb-4 text-justify">
              Ao clicar em ativar instituição ela será reativada em todo o
              sistema. Você realmente deseja ativar essa instituição e suas
              dependências no sistema?
            </Typography>
            <span className="flex space-x-2 justify-start items-center pt-2">
              <Checkbox
                id="checkbox"
                name="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.checkbox}
              />
              <label htmlFor="checkbox" className="cursor-pointer">
                <Typography variant="footnote1">
                  Estou ciente que a instituição será ativada integralmente no
                  sistema.
                </Typography>
              </label>
            </span>
            <div className="mt-3">
              {formik.errors.checkbox ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.checkbox}
                </Typography>
              ) : null}
            </div>
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" onClick={closeModal} label="Cancelar" />
          <Button
            color="success"
            type="submit"
            label="Ativar instituição"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default Activate;
