import * as React from 'react';
import { Form, Formik } from 'formik';
import { ActionBox, Button } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { MoveItemsFormValues, MoveItemsModalProps } from './types';
import DirectoriesListParentDirectory from './DirectoriesListParentDirectory';
import DirectoriesList from './DirectoriesList';

const MoveItemsModal = ({
  indexDirectoriesParams,
  onSubmit,
  organizationId,
  selectedDirectoryIds,
  selectedDocumentIds,
  setIndexDirectoriesParams,
}: MoveItemsModalProps) => {
  const { closeModal } = useModal();
  const [parentDirectory, setParentDirectory] = React.useState<number | null>(
    null
  );
  const [buttonLabel, setButtonLabel] = React.useState<string>('Mover para');

  React.useEffect(() => {
    setButtonLabel('Mover para');
  }, [parentDirectory]);

  const initialValues: MoveItemsFormValues = {
    batchAction: 'move_and_keep',
    directoryIds: selectedDirectoryIds,
    documentIds: selectedDocumentIds,
    payload: {
      directoryId: parentDirectory as number,
    },
  };

  return (
    <div>
      <ActionBox className="max-w-full">
        <ActionBox.Header
          title="Mover para"
          icon="moveDocTo"
          fill
          stroke
          color="blue"
          onClose={closeModal}
        />
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit({
              ...values,
              payload: { directoryId: Number(values.payload.directoryId) },
            });
          }}
          enableReinitialize
        >
          {(formik) => (
            <Form>
              <ActionBox.Content className="sm:w-[569px]">
                <div className="space-y-4">
                  <DirectoriesListParentDirectory
                    indexDirectoriesParams={indexDirectoriesParams}
                    setIndexDirectoriesParams={setIndexDirectoriesParams}
                    organizationId={organizationId}
                    setParentDirectory={setParentDirectory}
                  />
                  <DirectoriesList
                    onChange={(event) => {
                      formik.handleChange(event);
                      setButtonLabel('Mover');
                    }}
                    selectedDirectory={
                      formik.values.payload.directoryId as number
                    }
                    organizationId={organizationId}
                    indexDirectoriesParams={indexDirectoriesParams}
                    setIndexDirectoriesParams={setIndexDirectoriesParams}
                  />
                </div>
              </ActionBox.Content>
              <ActionBox.Footer>
                <Button
                  label="Cancelar"
                  color="error"
                  type="button"
                  onClick={closeModal}
                />
                <Button label={buttonLabel} color="info" type="submit" />
              </ActionBox.Footer>
            </Form>
          )}
        </Formik>
      </ActionBox>
    </div>
  );
};

export default MoveItemsModal;
