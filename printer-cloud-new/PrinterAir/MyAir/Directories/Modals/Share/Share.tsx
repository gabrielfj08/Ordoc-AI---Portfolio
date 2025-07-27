import * as React from 'react';
import { Formik, Form } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../../hooks';
import {
  ShareDirectoryModalFormValues,
  ShareDirectoryModalProps,
} from './types';
import SharedDirectoriesModal from './SharedDirectories';
import ShareDirectoryModalUserList from './User';
import UserSelect from './User/Select';

const ShareDirectoryModal = ({
  directory,
  onSubmit,
}: ShareDirectoryModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues: ShareDirectoryModalFormValues = {
    directoryId: directory.id,
  } as ShareDirectoryModalFormValues;

  return (
    <ActionBox>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: ShareDirectoryModalFormValues) => {
          onSubmit(values).catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
        }}
      >
        {(formik) => (
          <Form>
            <ActionBox.Header
              title="Compartilhar"
              color="blue"
              icon="shared"
              onClose={closeModal}
              fill
            />
            <ActionBox.Content>
              <div className="sm:w-[569px]">
                <div className="space-y-3 pb-4 border-b-2 border-lightGray">
                  <Typography variant="footnote1" family="robotoMedium">
                    Selecione o usuário desejado:
                  </Typography>
                  <UserSelect name="userId" directoryId={directory.id} />
                </div>
                <div className="pt-4">
                  <div className="pb-4 items-center justify-center flex">
                    <Typography variant="footnote1" family="robotoMedium">
                      Usuários com acesso a esta pasta:
                    </Typography>
                  </div>
                  <div className="w-full sm:max-h-44 max-h-28 overflow-y-auto rounded-2xl">
                    <ShareDirectoryModalUserList directory={directory} />
                  </div>
                </div>
                <div className="p-4 items-center justify-center flex">
                  <Typography variant="footnote1" family="robotoMedium">
                    Pasta que será compartilhada
                  </Typography>
                </div>
                <div className="space-y-3 w-full sm:max-h-44 max-h-28 overflow-y-auto">
                  <SharedDirectoriesModal directory={directory} />
                </div>
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                type="button"
                color="error"
                label="Cancelar"
                onClick={closeModal}
              />
              <Button
                type="submit"
                color="blue"
                label="Compartilhar"
                onClick={closeModal}
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default ShareDirectoryModal;
