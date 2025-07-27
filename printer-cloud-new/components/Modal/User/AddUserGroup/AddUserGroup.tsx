import * as React from 'react';
import { useFormik } from 'formik';
import {
  ActionBox,
  Button,
  Item,
  MultipleSelect,
  Typography,
} from 'printer-ui';
import { useModal, useSnackbar } from '../../../../hooks';
import { AddUserGroupFormValues, AddUserGroupProps } from './types';

const AddUserGroup = ({
  userGroups,
  currentUserGroups,
  onSubmit,
}: AddUserGroupProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const initialValues = {
    userGroupIds: [],
  };

  const formik = useFormik<AddUserGroupFormValues>({
    initialValues,
    onSubmit: (values) => {
      onSubmit(values)
        .then(() => {
          closeModal();
          showSnackbar(`Grupo adicionado com sucesso.`, 'success');
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
      selectedItems.map((userGroup) => userGroup.value)
    );
  }, [selectedItems]);

  return (
    <ActionBox>
      <form onSubmit={formik.handleSubmit}>
        <ActionBox.Header
          title="Adicionar usuário ao grupo"
          color="blue"
          icon="group"
          stroke
          onClose={closeModal}
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-3">
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
                ?.filter(
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
                    label: item.name,
                    value: item.id,
                  };
                })}
              w={144}
            />
          </div>
        </ActionBox.Content>
        <ActionBox.Footer>
          <Button type="button" onClick={closeModal} label="Cancelar" />
          <Button
            color="blue"
            type="submit"
            label="Adicionar grupo"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </form>
    </ActionBox>
  );
};

export default AddUserGroup;
