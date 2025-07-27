import * as React from 'react';
import { Formik, Form } from 'formik';
import { queryClient } from '../../../../queryClient';
import { Button, MultipleSelect, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { multipleSelectItem } from '../../../../types';
import {
  SelectTaskAttachmentProps,
  SelectTaskAttachmentFormValues,
} from './types';

const SelectTaskAttachment = ({
  onSubmit,
  setMentionVisibility,
  taskId,
  taskStatus,
  procedureDocuments,
  taskDocuments,
}: SelectTaskAttachmentProps) => {
  const { showSnackbar } = useSnackbar();
  const formikRef = React.useRef<Formik>(null);
  const [selectedTaskDocuments, setSelectedTaskDocuments] = React.useState<
    multipleSelectItem[]
  >([]);
  const [selectedProcedureDocuments, setSelectedProcedureDocuments] =
    React.useState<multipleSelectItem[]>([]);

  const initialValues = {
    taskId: taskId,
    procedureDocumentIds: [],
    taskDocumentIds: [],
  } as SelectTaskAttachmentFormValues;

  React.useEffect(() => {
    formikRef.current?.setFieldValue(
      'procedureDocumentIds',
      selectedProcedureDocuments.map(
        (procedureDocument) => procedureDocument.value
      )
    );
  }, [selectedProcedureDocuments]);

  React.useEffect(() => {
    formikRef.current?.setFieldValue(
      'taskDocumentIds',
      selectedTaskDocuments.map((taskDocument) => taskDocument.value)
    );
  }, [selectedTaskDocuments]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(values, actions) =>
        onSubmit(values)
          .then(() => {
            queryClient.invalidateQueries();
            showSnackbar('Documento mencionado com sucesso.', 'success');
            setMentionVisibility(false);
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          })
          .finally(() => {
            actions.setSubmitting(false);
          })
      }
    >
      {(formik) => (
        <Form>
          <div className="space-y-2">
            <div className="overflow-hidden w-full">
              <Typography variant="footnote1" family="robotoMedium">
                Selecione os documentos do processo a serem mencionados:
              </Typography>
            </div>
            <MultipleSelect
              name="procedureDocumentIds"
              setSelectedItems={setSelectedProcedureDocuments}
              selectedItems={selectedProcedureDocuments}
              placeholder="Selecione os documentos do processo a serem mencionados"
              noOptionsMessage="Nenhum documento de processo encontrado."
              items={procedureDocuments}
              w={144}
            />
            <div className="overflow-hidden w-full">
              <Typography variant="footnote1" family="robotoMedium">
                Selecione os documentos da tarefa a serem mencionados:
              </Typography>
            </div>
            <MultipleSelect
              name="taskDocumentIds"
              setSelectedItems={setSelectedTaskDocuments}
              selectedItems={selectedTaskDocuments}
              placeholder="Selecione os documentos da tarefa a serem mencionados"
              noOptionsMessage="Nenhum documento de tarefas encontrado."
              items={taskDocuments}
              w={144}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            {taskStatus === 'started' ? null : (
              <Button
                type="button"
                color="error"
                label="Cancelar"
                onClick={() => {
                  setMentionVisibility(false);
                }}
              />
            )}

            <Button
              type="submit"
              color="info"
              label="Salvar menção"
              disabled={
                formik.isSubmitting ||
                (!formik.values.procedureDocumentIds.length &&
                  !formik.values.taskDocumentIds.length)
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SelectTaskAttachment;
