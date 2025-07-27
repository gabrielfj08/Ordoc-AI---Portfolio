import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Checkbox, Icon, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { OrganizationService } from '../../../../services';
import { OrganizationModalProps } from '../types';

const Deactivate = ({ id, name }: OrganizationModalProps) => {
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
      OrganizationService.deactivate(token, subdomain, id)
        .then(() => {
          closeModal();
          showSnackbar(
            `A instituição ${name} foi desativada com sucesso.`,
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
          title="Desativar instituição"
          color="error"
          icon="institution"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <Typography variant="footnote1">
              Você tem certeza da sua ação?
            </Typography>
            <Typography variant="footnote1" className="pt-4 pb-4 text-justify">
              Ao clicar em desativar instituição você irá bloquear o acesso dos
              usuários e gerentes a todos aos grupos, diretórios e arquivos da
              instituição. Além disso, iniciará a geração de download de toda a
              estrutura de arquivos e registros de uso do sistema da
              instituição:
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {name}
            </Typography>
            <div className="flex space-x-2 justify-start items-center">
              <Icon alt="info" name="info" color="red" stroke w={25} h={25} />
              <Typography variant="footnote1" family="robotoBold" color="error">
                A exclusão da instituição será disponibilizada em 30 dias.
              </Typography>
            </div>
            <span className="flex space-x-2 justify-start items-center pt-2">
              <Checkbox
                id="checkbox"
                name="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.checkbox}
              />
              <label htmlFor="checkbox" className="cursor-pointer">
                <Typography variant="footnote1">
                  Estou ciente de que os acessos à instituição serão
                  desativados.
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
            color="error"
            type="submit"
            label="Desativar instituição"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default Deactivate;
