import * as React from 'react';
import { AttachmentUploadListProps } from './types';
import AttachmentUploadListItem from './AttachmentUploadListItem';

const AttachmentUploadList = ({
  fieldName,
  formik,
  procedureId,
  procedureDocumentUuids,
  procedureDocumentView,
  setProcedureDocumentUUids,
  setProcedureDocumentView,
}: AttachmentUploadListProps) => {
  const [failedDocumentUuid, setFailedDocumentUuid] = React.useState<
    Array<string>
  >([]);
  const [removeItemUuid, setRemoveItemUuid] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    const itemsToRemoveSet = new Set(removeItemUuid);
    setProcedureDocumentUUids((prevState) => [
      ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
    ]);
    setProcedureDocumentView((prevState) => [
      ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
    ]);
  }, [removeItemUuid]);

  React.useEffect(() => {
    const documentsToRemoveSet = new Set(failedDocumentUuid);
    formik.setFieldValue(
      `${fieldName}`,
      procedureDocumentUuids.filter((item) => !documentsToRemoveSet.has(item))
    );
    setProcedureDocumentUUids((prevState) => [
      ...prevState.filter((item) => !documentsToRemoveSet.has(item)),
    ]);
  }, [failedDocumentUuid]);

  return (
    <div className="flex flex-col gap-2 my-4 w-full max-h-32 overflow-x-auto">
      {procedureDocumentView.map((procedureDocument) => (
        <AttachmentUploadListItem
          fieldName={fieldName}
          formik={formik}
          key={procedureDocument}
          procedureId={procedureId}
          procedureDocumentUuid={procedureDocument}
          procedureDocumentUuids={procedureDocumentUuids}
          setFailedDocumentUuid={setFailedDocumentUuid}
          setRemoveItemUuid={setRemoveItemUuid}
        />
      ))}
    </div>
  );
};

export default AttachmentUploadList;
