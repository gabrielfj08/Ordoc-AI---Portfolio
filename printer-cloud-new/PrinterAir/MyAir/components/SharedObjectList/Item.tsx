import * as React from 'react';
import { useFormik } from 'formik';
import { Avatar, Button, List, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import {
  ShareModalUserListItemProps,
  ShareModalUserListItemFormValues,
} from './types';

const SharedModalUserListItem = ({
  sharedObjectId,
  user,
  onSubmit,
}: ShareModalUserListItemProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues: ShareModalUserListItemFormValues = {
    sharedObjectId: sharedObjectId,
  };

  const formik = useFormik<ShareModalUserListItemFormValues>({
    initialValues: initialValues,
    onSubmit: () => {},
  });

  return (
    <form>
      <List.Item className="flex justify-between w-full border-b-2 border-lightGray bg-lighterGray hover:bg-blue/5">
        <div className="flex space-x-3 items-center truncate">
          <Avatar
            src={user.avatarUrl}
            size="md"
            placeholder={user.name.charAt(0)}
            className="mr-2"
          />
          <div className="w-32 sm:w-80 space-y-1 truncate">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="truncate"
            >
              {user.name}
            </Typography>
            <div className="w-32 sm:w-80 truncate">
              <Typography variant="caption" className="truncate">
                {user.email}
              </Typography>
            </div>
          </div>
        </div>
        <Button
          label="Remover"
          color="red"
          type="button"
          onClick={() => {
            onSubmit(formik.values)
              .then(() => {
                showSnackbar('Usuário removido com sucesso', 'success');
                queryClient.invalidateQueries();
              })
              .catch((error) => {
                showSnackbar(error.response.data.message, 'error');
              });
          }}
        />
      </List.Item>
    </form>
  );
};

export default SharedModalUserListItem;
