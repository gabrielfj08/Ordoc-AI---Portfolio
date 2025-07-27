import * as React from 'react';
import { useFormik } from 'formik';
import { useModal } from '../../../../hooks';
import { ActionBox, Button, MultipleSelect, Typography } from 'printer-ui';
import { multipleSelectItem } from '../../../../types';
import { AddPoliciesProps } from '../types';

const AddPolicies = ({
  buttonLoading,
  onSubmit,
  userGroupPolicies,
  currentUserGroupPolicies,
}: AddPoliciesProps) => {
  const { closeModal } = useModal();
  const [selectedItems, setSelectedItems] = React.useState<
    multipleSelectItem[]
  >([]);

  const formik = useFormik({
    initialValues: {
      policy_ids: selectedItems,
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  React.useEffect(() => {
    formik.setFieldValue(
      'policy_ids',
      selectedItems.map((policy) => policy.value)
    );
  }, [selectedItems]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ActionBox>
        <ActionBox.Header
          title="Adicionar novas permissões"
          color="blue"
          icon="done"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <Typography variant="headline" family="robotoMedium">
              Selecione a permissão desejada:
            </Typography>
            <MultipleSelect
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              placeholder="Selecione a permissão"
              items={userGroupPolicies
                .filter(
                  (userPolicy: { id: number }) =>
                    !currentUserGroupPolicies
                      .map((currentPolicy: { id: number }) => currentPolicy.id)
                      .includes(userPolicy.id)
                )
                .map((item: any) => {
                  return {
                    label: `${item.name}`,
                    value: item.id,
                  };
                })}
              w={144}
              noOptionsMessage="Nenhuma permissão encontrada."
            />
          </div>
        </ActionBox.Content>
        <ActionBox.Footer className="justify-between">
          <Button type="button" label="Cancelar" onClick={closeModal} />
          <Button
            type="submit"
            color="blue"
            label="Adicionar permissão"
            disabled={buttonLoading}
          />
        </ActionBox.Footer>
      </ActionBox>
    </form>
  );
};

export default AddPolicies;
