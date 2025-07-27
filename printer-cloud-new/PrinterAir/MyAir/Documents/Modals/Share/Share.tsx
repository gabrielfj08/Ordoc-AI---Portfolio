import * as React from 'react';
import { Formik, Form } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal, useSnackbar } from '../../../../../hooks';
import { SharedModalProps, ShareDocumentModalFormValues } from './types';
import ShareDocumentModalUserList from './Users';
import SharedDocumentsModal from './SharedDocument';
import UserSelect from './Users/Select';

const ShareDocumentModal = ({ document, onSubmit }: SharedModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const initialValues: ShareDocumentModalFormValues = {
    documentId: document.id,
  } as ShareDocumentModalFormValues;

  return (
    <ActionBox>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: ShareDocumentModalFormValues) => {
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
                  <UserSelect documentId={document.id} name="userId" />
                </div>
                <div className="pt-4">
                  <div className="pb-4 items-center flex">
                    <Typography variant="footnote1" family="robotoMedium">
                      Usuários com acesso a este arquivo:
                    </Typography>
                  </div>
                  <div className="py-1 w-full sm:max-h-44 max-h-28 overflow-y-auto rounded-2xl">
                    <ShareDocumentModalUserList document={document} />
                  </div>
                </div>
                <div className="py-4 items-center flex">
                  <Typography variant="footnote1" family="robotoMedium">
                    Arquivo a ser compartilhado:
                  </Typography>
                </div>
                <div className="space-y-3 w-full sm:max-h-44 max-h-28 overflow-y-auto">
                  <SharedDocumentsModal document={document} />
                </div>
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                type="button"
                color="error"
                onClick={closeModal}
                label="Cancelar"
              />
              <Button
                onClick={closeModal}
                type="submit"
                color="blue"
                label="Compartilhar"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default ShareDocumentModal;
