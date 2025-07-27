import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, Typography, Checkbox } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { UserService } from '../../../../services';
import { DeleteUserProps } from '../types';

const DeleteUser = ({ userName, id }: DeleteUserProps) => {
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
      UserService.deleteUser(token, subdomain, id)
        .then(() => {
          closeModal();
          queryClient.invalidateQueries(['users', {}]);
          showSnackbar(`Usuário excluído com sucesso.`, 'success');
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
          title="Excluir usuário"
          color="error"
          icon="user"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <Typography variant="footnote1">
              Você tem certeza que quer excluir do Printer Cloud o usuário
              abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userName}
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
                  Estou ciente que o usuário será permanentemente excluído de
                  todo o sistema Printer Cloud.
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
            label="Excluir usuário"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default DeleteUser;
