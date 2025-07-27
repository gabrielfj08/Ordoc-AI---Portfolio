import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { UserService } from '../../../../services';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { DeactivateUserModalProps } from './types';

const DeactivateUser = ({ user }: DeactivateUserModalProps) => {
  const { closeModal } = useModal();
  const { subdomain, token } = useAuth();
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
      UserService.deactivate(token, subdomain, user.id)
        .then(() => {
          closeModal();
          showSnackbar('Usuário desativado com sucesso!', 'success');
          queryClient.invalidateQueries({
            queryKey: ['users'],
          });
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
    <div>
      <ActionBox>
        <form onSubmit={formik.handleSubmit}>
          <ActionBox.Header
            title="Desativar usuário"
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
              <Typography variant="footnote1">
                Ao clicar em desativar usuário você estará o desativando de
                todos os grupos, diretórios, arquivos e acessos da instituição.
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
                    Estou ciente de que o usuário será desativado.
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
            <Button label="Cancelar" onClick={closeModal} type="button" />
            <Button
              label="Desativar usuário"
              color="error"
              disabled={formik.isSubmitting}
              type="submit"
            />
          </ActionBox.Footer>
        </form>
      </ActionBox>
    </div>
  );
};

export default DeactivateUser;
