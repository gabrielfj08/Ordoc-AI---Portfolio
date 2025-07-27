import * as React from 'react';
import { useFormik } from 'formik';
import {
  ActionBox,
  Button,
  Typography,
  MultipleSelect,
  Item,
} from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import {
  AttachPolicyToUserGroupsFormValues,
  AttachPolicyToUserGroupsProps,
} from './types';

const AttachToUserGroups = ({
  userGroups,
  currentUserGroups,
  onSubmit,
}: AttachPolicyToUserGroupsProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const initialValues = {
    userGroupIds: [],
  };

  const formik = useFormik<AttachPolicyToUserGroupsFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          closeModal();
          showSnackbar('Grupo adicionado com sucesso.', 'success');
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
      'userGroupIds',
      selectedItems.map((userGroup) => parseInt(userGroup.value))
    );
  }, [selectedItems]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ActionBox>
        <ActionBox.Header
          title="Adicionar grupos à permissão"
          color="blue"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-2">
            <Typography variant="headline" family="robotoMedium">
              Selecione os grupos desejados:
            </Typography>
            <MultipleSelect
              name="userGroupIds"
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              placeholder="Selecione os grupos"
              noOptionsMessage="Nenhum grupo encontrado."
              items={userGroups
                .filter(
                  (userGroup: { id: number }) =>
                    !currentUserGroups
                      .map(
                        (currentUserGroup: { id: number }) =>
                          currentUserGroup.id
                      )
                      .includes(userGroup.id)
                )
                .map((item: any) => {
                  return {
                    label: `${item.name}`,
                    value: item.id,
                  };
                })}
              w={144}
            />
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" label="Cancelar" onClick={closeModal} />
          <Button
            type="submit"
            color="blue"
            label="Adicionar grupos"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </ActionBox>
    </form>
  );
};

export default AttachToUserGroups;
