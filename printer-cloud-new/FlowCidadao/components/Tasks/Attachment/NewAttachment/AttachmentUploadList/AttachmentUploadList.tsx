import * as React from 'react';
import { AttachmentUploadListProps } from './types';
import NewExternalAttachmentItem from './NewAttachmentItem';

const AttachmentExternalUploadList = ({
  taskId,
  formik,
  fieldName,
  taskDocumentIds,
  taskDocumentView,
  setTaskDocumentIds,
  setTaskDocumentView,
  setIsUploading,
}: AttachmentUploadListProps) => {
  const [failedAttachmentIds, setFailedAttachmentIds] = React.useState<
    Array<number>
  >([]);

  const [removeItemId, setRemoveItemId] = React.useState<Array<number>>([]);

  React.useEffect(() => {
    const itemsToRemoveSet = new Set(removeItemId);
    setTaskDocumentIds((prevState) => [
      ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
    ]);
    setTaskDocumentView((prevState) => [
      ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
    ]);
  }, [removeItemId]);

  React.useEffect(() => {
    const documentsToRemoveSet = new Set(failedAttachmentIds);
    setTaskDocumentIds((prevState) => [
      ...prevState.filter((item) => !documentsToRemoveSet.has(item)),
    ]);
  }, [failedAttachmentIds]);

  return (
    <div className="min-h-[46px] overflow-y-auto max-h-28 w-full grid grid-cols-3 gap-2">
      {taskDocumentView.map((taskDocument) => (
        <NewExternalAttachmentItem
          key={taskDocument}
          taskId={taskId}
          fieldName={fieldName}
          formik={formik}
          taskDocumentId={taskDocument}
          taskDocumentIds={taskDocumentIds}
          setFailedDocumentId={setFailedAttachmentIds}
          setRemoveItemId={setRemoveItemId}
          setIsUploading={setIsUploading}
        />
      ))}
    </div>
  );
};

export default AttachmentExternalUploadList;
