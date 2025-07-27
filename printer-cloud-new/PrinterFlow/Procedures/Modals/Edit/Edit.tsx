import * as React from 'react';
import { Form, Formik } from 'formik';
import { ActionBox, Typography, Button, Input } from 'printer-ui';
import {
  useModal,
  useSessionGroupRequester,
  useSnackbar,
} from '../../../../hooks';
import { EditProcedureInfoFormValues, EditProcedureModalProps } from './types';
import SelectRequesters from '../../../components/Procedures/ProcedureSelects/SelectRequesters';
import SelectVisibility from '../../../components/Procedures/ProcedureSelects/SelectVisibility';
import SelectPriority from '../../../components/Procedures/ProcedureSelects/SelectPriority';
import ShowAttachment from '../../New/Info/ShowAttachment';

const EditProcedureModal = ({
  onSubmit,
  procedure,
}: EditProcedureModalProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const { sessionGroupRequester } = useSessionGroupRequester();

  const initialValues = {
    responsibleGroupId: Number(sessionGroupRequester?.id),
    requesterId: Number(procedure.requester.id),
    priority: procedure.priority,
    source: procedure.source,
    private: procedure.private,
    deadline: procedure.deadline,
    payload: procedure.payload,
  } as EditProcedureInfoFormValues;

  return (
    <ActionBox className="max-w-full">
      <ActionBox.Header
        title="Editar dados do processo"
        icon="write"
        color="blue"
        fill
        stroke
        onClose={closeModal}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              showSnackbar(`Dados do processo salvos com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <ActionBox.Content>
              <div className="sm:w-[569px] space-y-6">
                <div className="sm:flex sm:space-x-10 w-full">
                  <div className="space-y-2 sm:mb-0 mb-6 w-1/2">
                    <Typography variant="footnote1" family="robotoMedium">
                      Grupo de origem*:
                    </Typography>
                    <div className="w-full py-1.5">
                      <Typography variant="headline" color="gray">
                        {sessionGroupRequester?.name}
                      </Typography>
                    </div>
                  </div>
                  <div className="space-y-2 sm:mb-0 mb-6">
                    <Typography variant="footnote1" family="robotoMedium">
                      Solicitante*:
                    </Typography>
                    <SelectRequesters
                      name="requesterId"
                      requester={procedure.requester}
                    />
                  </div>
                </div>
                <div className="sm:flex sm:space-x-10">
                  <div className="space-y-2 sm:mb-0 mb-6">
                    <Typography variant="footnote1" family="robotoMedium">
                      Visibilidade:
                    </Typography>
                    <SelectVisibility name="private" />
                  </div>
                  <div className="space-y-2 sm:mb-0 mb-6">
                    <Typography variant="footnote1" family="robotoMedium">
                      Prazo:
                    </Typography>
                    <Input
                      name="deadline"
                      id="deadline"
                      type="date"
                      w="full"
                      size="md"
                      onChange={formik.handleChange}
                      value={formik.values.deadline}
                    />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="footnote1" family="robotoMedium">
                      Prioridade:
                    </Typography>
                    <SelectPriority name="priority" />
                  </div>
                </div>
                <div className="sm:flex w-full">
                  <div className="space-y-2 sm:mb-0 mb-6 w-1/2">
                    <Typography variant="footnote1" family="robotoMedium">
                      Tipo de processo*:
                    </Typography>
                    <Typography variant="headline" color="gray">
                      {procedure.procedureTemplateName}
                    </Typography>
                  </div>

                  <div className="space-y-2 sm:mb-0 mb-6 w-1/2">
                    <Typography variant="footnote1" family="robotoMedium">
                      Assunto do tipo de processo:
                    </Typography>
                    <Typography variant="footnote1">
                      {procedure.parentProcedureTemplateName === null ? (
                        <Typography
                          variant="footnote1"
                          color="gray"
                          className="italic"
                        >
                          Sem assunto definido
                        </Typography>
                      ) : (
                        <Typography variant="footnote1">
                          {procedure.parentProcedureTemplateName}
                        </Typography>
                      )}
                    </Typography>
                  </div>
                </div>
                <div className="space-y-2 sm:mb-0 mb-6">
                  <Typography variant="footnote1" family="robotoMedium">
                    Anexos do assunto do tipo de processo:
                  </Typography>
                  <div className="w-full">
                    <ShowAttachment
                      procedureTemplateId={procedure.procedureTemplateId}
                    />
                  </div>
                </div>
              </div>
            </ActionBox.Content>

            <ActionBox.Footer>
              <Button
                type="button"
                onClick={closeModal}
                label="Cancelar"
                color="error"
              />
              <Button
                type="submit"
                color="info"
                label="Salvar alterações"
                disabled={formik.isSubmitting}
              />
            </ActionBox.Footer>
          </Form>
        )}
      </Formik>
    </ActionBox>
  );
};

export default EditProcedureModal;
