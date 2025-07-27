import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ActionBox, Button, Checkbox, Typography } from 'printer-ui';
import { useAuth, useModal, useSnackbar } from '../../../../hooks';
import { GroupModalProps } from '../types';
import UserGroupService from '../../../../services/UserGroup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { IndexUserGroup } from '../../../../services/types';
import { queryClient } from '../../../../queryClient';

const ActivateGroup = ({ userGroup }: GroupModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const { token, subdomain } = useAuth();
  const activateUserGroupMutation = useMutation((userGroup: IndexUserGroup) =>
    UserGroupService.activate(token, subdomain, userGroup.id)
  );

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
    onSubmit: () =>
      activateUserGroupMutation
        .mutateAsync(userGroup)
        .then(() => {
          closeModal();
          queryClient.invalidateQueries(['userGroups', {}]);
          showSnackbar('Grupo ativado com sucesso', 'success');
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        }),
  });

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Ativar grupo"
          color="success"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-4">
            <Typography variant="footnote1">
              Você tem certeza de que quer ativar o grupo abaixo?
            </Typography>
            <Typography variant="footnote1" family="robotoBold" color="blue">
              {userGroup.name}
            </Typography>
            <Typography variant="footnote1" className="text-justify">
              Ao clicar em ativar, o grupo será reativado dentro da instituição.
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
                  Estou ciente que o grupo será ativado.
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
            label="Ativar grupo"
            color="success"
            type="submit"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default ActivateGroup;
