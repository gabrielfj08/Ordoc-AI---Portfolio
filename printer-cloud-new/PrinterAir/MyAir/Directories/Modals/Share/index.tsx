import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActionSheet, useAuth, useSession } from '../../../../../hooks';
import { DirectoryService } from '../../../../../services/printer-air';
import {
  SharedDirectoryModalContainerProps,
  ShareDirectoryModalFormValues,
} from './types';
import SharedModal from './Share';
import DirectoryShareJob from '../../ActionSheets/DirectoryShareJob';

const ShareDirectoryModalContainer = ({
  directory,
}: SharedDirectoryModalContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();
  const { openActionSheet } = useActionSheet();

  const mutation = useMutation(
    (values: ShareDirectoryModalFormValues) =>
      DirectoryService.share(token, subdomain, session.organization.id, {
        ids: [directory.id],
        payload: {
          userId: values.userId,
        },
      }),
    {
      onSuccess: (values) => {
        openActionSheet(<DirectoryShareJob batchOperationJob={values} />);
      },
    }
  );

  const handleSubmit = (values: ShareDirectoryModalFormValues) => {
    return mutation.mutateAsync(values);
  };

  return <SharedModal directory={directory} onSubmit={handleSubmit} />;
};

export default ShareDirectoryModalContainer;
