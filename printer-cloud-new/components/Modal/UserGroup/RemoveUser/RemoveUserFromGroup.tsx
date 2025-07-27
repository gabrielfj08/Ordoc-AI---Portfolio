import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { getSubdomain } from '../../../../utils';
import { RemoveUserFromGroupModalProps } from '../types';

const RemoveUserFromGroup = ({
  user_id,
  userGroup,
}: RemoveUserFromGroupModalProps) => {
  const { closeModal } = useModal();
  const { token, subdomain } = useAuth();
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
      UserGroupService.removeUser(token, subdomain, userGroup.id, user_id)
        .then((res) => {
          closeModal();
          queryClient.invalidateQueries([
            'users',
            user_id,
            'userGroups',
            token,
          ]);
          showSnackbar(`Usuário removido com sucesso.`, 'success');
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
          title="Remover usuário do grupo"
          color="error"
          icon="user"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza da sua ação?
            </Typography>
            <Typography variant="footnote1" className="text-justify">
              Ao clicar em remover, o usuário perderá acesso ao grupo:
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userGroup.name}
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
                  Estou ciente de que o usuário será removido do grupo.
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
            label="Remover grupo"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default RemoveUserFromGroup;
