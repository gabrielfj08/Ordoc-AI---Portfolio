import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { getSubdomain } from '../../../../utils';
import { ActionBox, Button, Typography, Checkbox } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { DetachPolicyFromUserGroupProps } from '../types';

const DetachFromUserGroup = ({
  policy_id,
  user_group_id,
  user_group_name,
}: DetachPolicyFromUserGroupProps) => {
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
      UserGroupService.detachForUserGroup(
        token,
        getSubdomain(),
        user_group_id,
        policy_id
      )
        .then(() => {
          closeModal();
          queryClient.invalidateQueries([
            'policies',
            policy_id,
            'userGroups',
            token,
          ]);
          queryClient.invalidateQueries(['policies', policy_id, token]);
          showSnackbar(`Grupo removido com sucesso.`, 'success');
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
          title="Remover grupo da permissão"
          color="error"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza que quer remover o grupo abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {user_group_name}
            </Typography>
            <Typography variant="footnote1">
              Ao clicar em remover, o grupo perderá os acessos desta permissão
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
                  Estou ciente que o grupo será removido da permissão.
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
            label="Remover grupo"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default DetachFromUserGroup;
