import * as React from 'react';
import { NewProcedureAttachmentUploadListProps } from './types';
import AttachmentListItem from './AttachmentListItem';

const NewProcedureAttachmentUploadList = React.forwardRef(
  (
    {
      fieldName,
      formik,
      color,
      procedureId,
      disabled,
      procedureDocumentUuids,
      procedureDocumentView,
      setProcedureDocumentUUids,
      setProcedureDocumentView,
      setAttachmentLoading,
    }: NewProcedureAttachmentUploadListProps,
    ref
  ) => {
    const [failedDocumentUuid, setFailedDocumentUuid] = React.useState<
      Array<string>
    >([]);
    const [removeItemUuid, setRemoveItemUuid] = React.useState<Array<string>>(
      []
    );

    React.useEffect(() => {
      const itemsToRemoveSet = new Set(removeItemUuid);
      setProcedureDocumentUUids((prevState) => [
        ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
      ]);
      setProcedureDocumentView((prevState) => [
        ...prevState.filter((item) => !itemsToRemoveSet.has(item)),
      ]);
    }, [ref, removeItemUuid]);

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
      <div className="grid grid-cols-3 gap-6 w-full">
        {procedureDocumentView.map((procedureDocument) => (
          <AttachmentListItem
            disabled={disabled}
            color={color}
            fieldName={fieldName}
            formik={formik}
            key={procedureDocument}
            procedureId={procedureId}
            procedureDocumentUuid={procedureDocument}
            procedureDocumentUuids={procedureDocumentUuids}
            setFailedDocumentUuid={setFailedDocumentUuid}
            setRemoveItemUuid={setRemoveItemUuid}
            setAttachmentLoading={setAttachmentLoading}
          />
        ))}
      </div>
    );
  }
);
export default NewProcedureAttachmentUploadList;
