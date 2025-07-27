import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth, useSnackbar } from '../../../../../hooks';
import { FieldService } from '../../../../../services/printer-flow';
import { menuOptions } from '../../../../../components/MenuButton/types';
import { FieldsMenuButtonContainerProps } from './types';
import FieldsMenuButton from './MenuButton';

const FieldsMenuButtonContainer = ({
  field,
  setType,
}: FieldsMenuButtonContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () =>
      FieldService.deleteField(
        token,
        subdomain,
        field.procedureTemplateId,
        field.id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'fields',
          subdomain,
          token,
          field.procedureTemplateId,
          {},
        ]);
      },
    }
  );

  if (field.fieldType === 'checkbox' || field.fieldType === 'select_field') {
    const options: Array<menuOptions> = [
      {
        label: 'Editar campo',
        icon: 'write',
        fill: true,
        stroke: true,
        onClick: () => {
          setType('edit');
        },
      },
      {
        label: 'Editar opções do campo',
        icon: 'write',
        fill: true,
        stroke: true,
        onClick: () => {
          setType('openFieldValueOption');
        },
      },

      {
        label: 'Remover',
        icon: 'trashV2',
        fill: true,
        stroke: true,
        onClick: () => {
          mutation
            .mutateAsync()
            .then(() => {
              showSnackbar(`Campo removido com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            });
        },
      },
    ];

    return <FieldsMenuButton options={options} />;
  }

  if (field.fieldType === 'attachment') {
    const options: Array<menuOptions> = [
      {
        label: 'Editar campo',
        icon: 'write',
        fill: true,
        stroke: true,
        onClick: () => {
          setType('edit');
        },
      },
      {
        label: 'Editar modelo de anexo do campo',
        icon: 'write',
        fill: true,
        stroke: true,
        onClick: () => {
          setType('openFieldDocumentTemplate');
        },
      },
      {
        label: 'Remover',
        icon: 'trashV2',
        fill: true,
        stroke: true,
        onClick: () => {
          mutation
            .mutateAsync()
            .then(() => {
              showSnackbar(`Campo removido com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            });
        },
      },
    ];

    return <FieldsMenuButton options={options} />;
  }

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () => {
        setType('edit');
      },
    },
    {
      label: 'Remover',
      icon: 'trashV2',
      fill: true,
      stroke: true,
      onClick: () => {
        mutation
          .mutateAsync()
          .then(() => {
            showSnackbar(`Campo removido com sucesso.`, 'success');
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
    },
  ];

  return <FieldsMenuButton options={options} />;
};

export default FieldsMenuButtonContainer;
