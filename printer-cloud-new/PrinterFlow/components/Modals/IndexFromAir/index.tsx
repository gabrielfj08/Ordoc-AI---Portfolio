import * as React from 'react';
import { Formik, Form } from 'formik';
import { ActionBox, Button } from 'printer-ui';
import { useSession, useModal, useAuth } from '../../../../hooks';
import { TaskDocumentService } from '../../../../services/printer-flow';
import {
  CreateTaskDocumentFormValues,
  IndexFromAirContainerProps,
} from './types';
import ParentDirectory from './ParentDirectory';
import ShowTask from '../../../Tasks/Modals/Show';
import DirectoryContent from './DirectoryContent';

const IndexFromAirContainer = ({ taskId }: IndexFromAirContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { openModal, closeModal } = useModal();

  const [directoryId, setDirectoryId] = React.useState<number>(
    session.organization.rootDirectory.id
  );

  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);

  const handleSubmit = (values: CreateTaskDocumentFormValues) => {
    values.taskDocuments.map((taskDocument) => {
      return TaskDocumentService.createV4(
        token,
        subdomain,
        taskId,
        taskDocument
      ).then(() => openModal(<ShowTask taskId={taskId} />));
    });
  };

  return (
    <ActionBox>
      <Formik
        initialValues={{ taskDocuments: [] }}
        onSubmit={(values: CreateTaskDocumentFormValues) =>
          handleSubmit(values)
        }
      >
        {(formik) => (
          <Form>
            <ActionBox.Header
              title="Anexar arquivo"
              color="blue"
              icon="uploadV3"
              stroke
              onClose={closeModal}
            />
            <ActionBox.Content className="space-y-4 sm:w-[569px] w-80 h-[336px] overflow-x-hidden overflow-y-auto">
              <ParentDirectory
                directoryId={directoryId}
                setDirectoryId={setDirectoryId}
                setIsAuthorized={setIsAuthorized}
              />
              <DirectoryContent
                directoryId={directoryId}
                setDirectoryId={setDirectoryId}
                formik={formik}
                isAuthorized={isAuthorized}
              />
            </ActionBox.Content>
            <ActionBox.Footer>
              <Button
                label="Cancelar"
                color="error"
                type="button"
                onClick={() => openModal(<ShowTask taskId={taskId} />)}
              />
              <Button
                label="Anexar"
                color="info"
                type="submit"
                disabled={formik.values.taskDocuments.length <= 0}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default IndexFromAirContainer;
