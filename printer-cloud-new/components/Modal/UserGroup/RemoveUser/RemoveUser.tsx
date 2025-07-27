import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserGroupService } from '../../../../services';
import { RemoveUserModalProps } from '../types';

const RemoveUser = ({ user, userGroup }: RemoveUserModalProps) => {
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
      UserGroupService.removeUser(token, subdomain, userGroup.id, user.id)
        .then(() => {
          closeModal();
          showSnackbar(`Usuário removido com sucesso.`, 'success');
          queryClient.invalidateQueries([
            'userGroups',
            userGroup.id,
            'users',
            token,
          ]);
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
              Você tem certeza que quer remover o seguinte usuário?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {user.name}
            </Typography>
            <Typography variant="footnote1" className="text-justify">
              Ao clicar em remover o usuário, ele será excluído do grupo abaixo:
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userGroup.name}
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
                  Estou ciente que o usuário perderá o acesso ao grupo.
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
            disabled={formik.isSubmitting}
            label="Remover usuário"
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default RemoveUser;
