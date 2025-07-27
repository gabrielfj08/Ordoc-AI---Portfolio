import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { RemovePolicyProps } from '../types';

const RemovePolicy = ({
  group_id,
  group_name,
  policy_id,
  policy_name,
}: RemovePolicyProps) => {
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
      UserGroupService.detachForUserGroup(token, subdomain, group_id, policy_id)
        .then(() => {
          queryClient.invalidateQueries(['userGroups', group_id, 'policies']);
          closeModal();
          showSnackbar(`Permissão removida com sucesso.`, 'success');
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
          title="Remover permissão do grupo"
          color="error"
          icon="done"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza que quer remover a seguinte permissão?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {policy_name}
            </Typography>
            <Typography variant="footnote1" className="text-justify">
              Ao clicar em remover a permissão, ela será excluída do grupo
              abaixo:
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {group_name}
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
                  Estou ciente que a permissão perderá o efeito no grupo.
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
            color="error"
            type="submit"
            label="Remover permissão"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default RemovePolicy;
