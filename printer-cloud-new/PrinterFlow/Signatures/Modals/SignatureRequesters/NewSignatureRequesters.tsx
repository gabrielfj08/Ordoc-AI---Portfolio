import * as React from 'react';
import { useFormik } from 'formik';
import { queryClient } from '../../../../queryClient';
import { ActionBox, Button, MultipleSelect, Typography } from 'printer-ui';
import { useModal, useSnackbar, useSession } from '../../../../hooks';
import { multipleSelectItem } from '../../../../types';
import {
  NewSignatureRequesterFormValues,
  NewSignatureRequestersModalProps,
} from './types';

const NewSignatureRequestersModal = ({
  procedure,
  onSubmit,
  requesters,
  taskDocuments,
  procedureDocuments,
}: NewSignatureRequestersModalProps) => {
  const { session } = useSession();
  const { showSnackbar } = useSnackbar();
  const { closeModal } = useModal();
  const [selectedRequesters, setSelectedRequesters] = React.useState<
    multipleSelectItem[]
  >([]);
  const [selectedTaskDocuments, setSelectedTaskDocuments] = React.useState<
    multipleSelectItem[]
  >([]);
  const [selectedProcedureDocuments, setSelectedProcedureDocuments] =
    React.useState<multipleSelectItem[]>([]);

  const initialValues = {
    requesterIds: [],
    procedureDocumentIds: [],
    taskDocumentIds: [],
    responsibleAssignee: '',
  } as NewSignatureRequesterFormValues;

  const formik = useFormik<NewSignatureRequesterFormValues>({
    initialValues: initialValues,
    onSubmit: (values) => {
      const payload = {
        requesterIds:
          values.responsibleAssignee === 'externalRequester'
            ? [procedure.requester.id]
            : values.requesterIds,
        procedureDocumentIds: values.procedureDocumentIds,
        taskDocumentIds: values.taskDocumentIds,
      };
      onSubmit(payload)
        .then(() => {
          closeModal();
          queryClient.invalidateQueries([]);
          showSnackbar('Assinatura solicitada com sucesso.', 'success');
        })
        .catch((error) => {
          showSnackbar(error.response.data.message, 'error');
        })
        .finally(() => {
          formik.setSubmitting(false);
        });
    },
  });

  React.useEffect(() => {
    formik.setFieldValue(
      'requesterIds',
      selectedRequesters.map((requester) => requester.value)
    );
  }, [selectedRequesters]);

  React.useEffect(() => {
    formik.setFieldValue(
      'procedureDocumentIds',
      selectedProcedureDocuments.map(
        (procedureDocument) => procedureDocument.value
      )
    );
  }, [selectedProcedureDocuments]);

  React.useEffect(() => {
    formik.setFieldValue(
      'taskDocumentIds',
      selectedTaskDocuments.map((taskDocument) => taskDocument.value)
    );
  }, [selectedTaskDocuments]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ActionBox>
        <ActionBox.Header
          title="Adicionar assinantes"
          color="blue"
          icon="signaturesV3"
          stroke
          onClose={closeModal}
          className="sm:h-[66px]"
        />
        <ActionBox.Content>
          <div className="sm:w-[569px] space-y-3">
            <div className="overflow-hidden w-full">
              <Typography variant="footnote1" family="robotoMedium">
                Adicionar assinantes*:
              </Typography>
            </div>
            {procedure.createdBy.id === session.externalUserId && (
              <div className="flex space-x-4 pb-2">
                <label
                  htmlFor="externalRequester"
                  className="flex items-center space-x-2 pb-2 pr-5 sm:pr-16"
                >
                  <input
                    type="radio"
                    value="externalRequester"
                    name="responsibleAssignee"
                    id="externalRequester"
                    checked={
                      formik.values.responsibleAssignee === 'externalRequester'
                    }
                    onChange={formik.handleChange}
                  />
                  <Typography variant="footnote1">
                    Solicitante externo
                  </Typography>
                </label>
                <label
                  htmlFor="internalRequester"
                  className="flex items-center space-x-2 pb-2 pr-5 sm:pr-16"
                >
                  <input
                    type="radio"
                    value="internalRequester"
                    name="responsibleAssignee"
                    id="internalRequester"
                    checked={
                      formik.values.responsibleAssignee === 'internalRequester'
                    }
                    onChange={formik.handleChange}
                  />
                  <Typography variant="footnote1">
                    Solicitante interno
                  </Typography>
                </label>
              </div>
            )}
            {(formik.values.responsibleAssignee === 'internalRequester' ||
              procedure.createdBy.id !== session.externalUserId) && (
              <MultipleSelect
                name="requesterIds"
                setSelectedItems={setSelectedRequesters}
                selectedItems={selectedRequesters}
                placeholder="Selecione os assinantes"
                noOptionsMessage="Nenhum solicitante encontrado."
                items={requesters}
                w={144}
              />
            )}
            <div className="overflow-hidden w-full">
              <Typography variant="footnote1" family="robotoMedium">
                Selecione os documentos do processo a serem assinados:
              </Typography>
            </div>
            <MultipleSelect
              name="procedureDocumentIds"
              setSelectedItems={setSelectedProcedureDocuments}
              selectedItems={selectedProcedureDocuments}
              placeholder="Selecione os documentos do processo a serem assinados"
              noOptionsMessage="Nenhum documento de processo encontrado."
              items={procedureDocuments}
              w={144}
            />
            <div className="overflow-hidden w-full">
              <Typography variant="footnote1" family="robotoMedium">
                Selecione os documentos da tarefa a serem assinados:
              </Typography>
            </div>
            <MultipleSelect
              name="taskDocumentIds"
              setSelectedItems={setSelectedTaskDocuments}
              selectedItems={selectedTaskDocuments}
              placeholder="Selecione os documentos da tarefa a serem assinados"
              noOptionsMessage="Nenhum documento de tarefas encontrado."
              items={taskDocuments}
              w={144}
            />
            <Typography variant="footnote2" color="darkGray">
              <i>
                *Solicitação de assinaturas somente em documentos com extensão
                PDF.
              </i>
            </Typography>
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
            color="info"
            label="Adicionar assinantes"
            disabled={formik.isSubmitting}
          />
        </ActionBox.Footer>
      </ActionBox>
    </form>
  );
};

export default NewSignatureRequestersModal;
