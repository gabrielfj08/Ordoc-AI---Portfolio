import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Typography, Select, Checkbox } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { OrganizationService } from '../../../../services';
import { cnpjMask } from '../../../../utils';
import { RemoveUserProps } from '../types';

const RemoveUser = ({ id, userName }: RemoveUserProps) => {
  const { subdomain, token } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const [organizations, setOrganizations] = React.useState<any[]>([]);

  React.useEffect(() => {
    OrganizationService.indexV3(token, subdomain, { user_id: id })
      .then((res) => {
        setOrganizations(
          res.organizations.map((items: any) => {
            return {
              id: `${items.id}`,
              value: `${cnpjMask(items.cnpj)} - ${items.corporateName}`,
            };
          })
        );
      })
      .catch(() => {});
  }, [setOrganizations]);

  const [selectedOrganization, setSelectedOrganization] = React.useState({
    id: '',
    value: 'Selecione a instituição',
  });

  const handleOrganizationChange = (item: any) => {
    formik.setFieldValue('organizationId', item.id);
    setSelectedOrganization(item);
  };

  const formik = useFormik({
    initialValues: {
      organizationId: '',
      checkbox: false,
    },
    validationSchema: Yup.object().shape({
      checkbox: Yup.bool().oneOf(
        [true],
        'Marque a caixa acima para prosseguir'
      ),
    }),
    onSubmit: () => {
      OrganizationService.removeUser(
        token,
        subdomain,
        parseInt(selectedOrganization.id),
        id
      )
        .then(() => {
          closeModal();
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
          title="Remover usuário"
          color="error"
          icon="user"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza que quer remover o usuário abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userName}
            </Typography>
            <Typography variant="footnote1" className="text-justify">
              Ao clicar em remover, o usuário perderá o acesso a todos os
              grupos, diretórios, arquivos e registros da instituição
              selecionada abaixo.
            </Typography>
            <Typography variant="footnote1" family="robotoBold">
              Instituição:
            </Typography>
            <div className="hidden sm:block">
              <Select
                size="lg"
                w="144"
                items={organizations}
                selectedItem={selectedOrganization}
                setSelectedItem={handleOrganizationChange}
              />
            </div>
            <div className="sm:hidden block">
              <Select
                size="md"
                w="72"
                items={organizations}
                selectedItem={selectedOrganization}
                setSelectedItem={handleOrganizationChange}
              />
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
                  Estou ciente que o usuário será removido.
                </Typography>
              </label>
            </span>
            <div className="mt-2">
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
            type="submit"
            color="error"
            label="Remover usuário"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default RemoveUser;
