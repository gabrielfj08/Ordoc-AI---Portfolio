import * as React from 'react';
import { useFormik } from 'formik';
import router from 'next/router';
import {
  ActionBox,
  Button,
  Typography,
  MultipleSelect,
  Item,
} from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { AddPolicyUserProps, AttachPolicyFormValues } from '../types';

const AddPoliciesUser = ({
  onSubmit,
  policies,
  currentPolicies,
}: AddPolicyUserProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const initialValues = {
    policyIds: [],
  };

  const formik = useFormik<AttachPolicyFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          closeModal();
          showSnackbar(`Permissão adicionada com sucesso.`, 'success');
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  React.useEffect(() => {
    formik.setFieldValue(
      'policyIds',
      selectedItems.map((policy) => policy.value)
    );
  }, [selectedItems]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeModal();
    {
      policies.map((policy) =>
        router.push(`/printer-cloud/policies/${policy.id}`)
      );
    }
  };

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Adicionar permissão ao usuário"
          color="blue"
          icon="done"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-3">
            <Typography variant="headline" family="robotoMedium">
              Selecione a permissão desejada:
            </Typography>
            <MultipleSelect
              w={144}
              name="policy_ids"
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              placeholder="Selecione a permissão"
              noOptionsMessage="Nenhuma permissão encontrada."
              items={policies
                .filter(
                  (policy: { id: number }) =>
                    !currentPolicies
                      .map((currentPolicy: { id: number }) => currentPolicy.id)
                      .includes(policy.id)
                )
                .map((item: any) => {
                  return {
                    label: `${item.name}`,
                    value: item.id,
                  };
                })}
              itemHandleClick={handleClick}
            />
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" onClick={closeModal} label="Cancelar" />
          <Button
            color="blue"
            type="submit"
            label="Adicionar permissão"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default AddPoliciesUser;
