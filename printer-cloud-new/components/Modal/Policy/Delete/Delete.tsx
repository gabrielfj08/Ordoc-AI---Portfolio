import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, Typography, Checkbox } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { PolicyService } from '../../../../services';
import { DeletePolicyProps } from '../types';

const Delete = ({ policy_id, policy_name }: DeletePolicyProps) => {
  const { token, subdomain } = useAuth();
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
      PolicyService.deletePolicy(token, subdomain, policy_id)
        .then(() => {
          closeModal();
          queryClient.invalidateQueries(['policies', {}]);
          showSnackbar(`Permissão excluída com sucesso.`, 'success');
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
          title="Excluir permissão"
          color="error"
          icon="done"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza da sua ação?
            </Typography>
            <Typography variant="footnote1">
              Ao clicar em excluir permissão, perderá todos os poderes sobre
              diretórios, arquivos, acessos e registros desta permissão:
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {policy_name}
            </Typography>
            <span className="flex space-x-2 justify-start items-center">
              <Checkbox
                id="checkbox"
                name="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.checkbox}
              />
              <label htmlFor="checkbox" className="cursor-pointer">
                <Typography variant="footnote1">
                  Estou ciente de que a permissão será excluída da instituição.
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
            label="Excluir permissão"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default Delete;
