import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, Button, Checkbox } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { RemoveItemsModalProps } from './types';
import RemoveDirectory from './RemoveDirectory';
import RemoveDocument from './RemoveDocument';

const RemoveItemsModal = ({
  onSubmit,
  selectedDirectoryIds,
  selectedDocumentIds,
}: RemoveItemsModalProps) => {
  const { closeModal } = useModal();

  const initialValues = {
    directoryIds: selectedDirectoryIds,
    documentIds: selectedDocumentIds,
    checkbox: false,
  };

  return (
    <ActionBox>
      <ActionBox.Header
        title="Remover"
        color="red"
        icon="trashV2"
        stroke
        fill
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit({
            ...values,
          });
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
        })}
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-2">
                <div className="overflow-hidden sm:w-auto w-72">
                  <Typography variant="headline" family="roboto">
                    Você tem certeza que quer excluir os itens abaixo?
                  </Typography>
                </div>
                {selectedDirectoryIds.length ? (
                  <div className="space-y-2">
                    <Typography variant="headline" family="robotoMedium">
                      Pasta
                    </Typography>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {selectedDirectoryIds.map((directoryId) => (
                        <RemoveDirectory directoryId={directoryId} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {selectedDocumentIds.length ? (
                  <div className="space-y-2">
                    <Typography variant="headline" family="robotoMedium">
                      Arquivos
                    </Typography>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {selectedDocumentIds.map((documentId) => (
                        <RemoveDocument documentId={documentId} />
                      ))}
                    </div>
                  </div>
                ) : null}
                <Typography variant="headline" family="roboto">
                  Ao clicar em remover, os itens serão removidos da seguinte
                  pasta:
                </Typography>
                <Typography
                  variant="headline"
                  family="robotoMedium"
                  color="blue"
                >
                  Meu Air
                </Typography>
                <span className="flex space-x-2 justify-start items-center pt-2">
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                  />
                  <label htmlFor="checkbox" className="cursor-pointer">
                    <Typography variant="headline" family="roboto">
                      Estou ciente que irei mover os itens para a lixeira.
                    </Typography>
                  </label>
                </span>
                {formik.errors.checkbox ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.checkbox}
                  </Typography>
                ) : null}
              </div>
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button type="button" onClick={closeModal} label="Cancelar" />
              <Button
                type="submit"
                color="error"
                label="Remover"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default RemoveItemsModal;
