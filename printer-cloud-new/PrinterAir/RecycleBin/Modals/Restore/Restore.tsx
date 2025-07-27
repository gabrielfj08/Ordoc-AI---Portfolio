import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { ActionBox, Button, Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { RestoreItemsModalProps } from './types';
import ItemsList from './ItemsList';

const RestoreItemsModal = ({
  onSubmit,
  selectedDirectories,
  selectedDocuments,
}: RestoreItemsModalProps) => {
  const { closeModal } = useModal();

  const totalItems = selectedDirectories.concat(selectedDocuments);

  const selectedDirectoryIds = selectedDirectories.map(
    (directory) => directory.id
  );
  const selectedDocumentIds = selectedDocuments.map((document) => document.id);

  const initialValues = {
    directoryIds: selectedDirectoryIds,
    documentIds: selectedDocumentIds,
    checkbox: false,
  };

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Recuperar"
        color="success"
        icon="recover"
        onClose={closeModal}
        fill
      />
      <Formik
        initialValues={initialValues}
        onSubmit={({ documentIds, directoryIds }) => {
          onSubmit({ directoryIds, documentIds });
        }}
        validationSchema={Yup.object().shape({
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir.'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content className="space-y-4">
              <Typography variant="footnote1">
                Você tem certeza que deseja recuperar
                {totalItems.length > 1 ? ' os itens ' : ' o item '}
                abaixo?
              </Typography>
              <ItemsList
                selectedDirectories={selectedDirectories}
                selectedDocuments={selectedDocuments}
              />
              <Typography variant="footnote1">
                Ao clicar em recuperar,
                {totalItems.length > 1
                  ? ' os itens serão movidos '
                  : ' o item será movido '}
                para a pasta de origem antes de sua exclusão.
              </Typography>
              <label className="flex items-center space-x-2 pt-2">
                <Field type="checkbox" name="checkbox" />
                <Typography variant="footnote1">
                  Estou ciente que irei recuperar
                  {totalItems.length > 1 ? ' os itens ' : ' o item '}
                  da lixeira.
                </Typography>
              </label>
              <div className="mt-3">
                {formik.errors.checkbox ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                label="Cancelar"
                color="error"
                type="button"
                onClick={closeModal}
              />
              <Button label="Recuperar" color="success" type="submit" />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default RestoreItemsModal;
