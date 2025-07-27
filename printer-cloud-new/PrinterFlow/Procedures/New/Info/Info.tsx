import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { Typography, Input, Button } from 'printer-ui';
import { useSessionGroupRequester, useSnackbar } from '../../../../hooks';
import { NewProcedureInfoFormValues, NewProcedureInfoProps } from './types';
import SelectProcedureTemplates from '../../../components/Procedures/ProcedureSelects/SelectProcedureTemplates';
import SelectGroupRequesters from '../../../components/Procedures/ProcedureSelects/SelectGroupRequesters';
import SelectSubjects from '../../../components/Procedures/ProcedureSelects/SelectSubjects';
import SelectPriority from '../../../components/Procedures/ProcedureSelects/SelectPriority';
import SelectRequesters from '../../../components/Procedures/ProcedureSelects/SelectRequesters';
import SelectVisibility from '../../../components/Procedures/ProcedureSelects/SelectVisibility';
import ShowAttachment from './ShowAttachment';
import FieldsPreview from '../FieldsPreview';

const NewProcedureInfo = ({
  onSubmit,
  requesters,
  procedureTemplates,
}: NewProcedureInfoProps) => {
  const { showSnackbar } = useSnackbar();
  const { sessionGroupRequester } = useSessionGroupRequester();
  const [key, setKey] = React.useState(0);

  if (!sessionGroupRequester) return null;

  const initialValues = {
    priority: 'normal',
    source: 'internal',
    private: false,
    deadline: '',
    requesterId: requesters?.id,
    procedureTemplateId: procedureTemplates?.id,
    subjectTemplateId: null,
  } as NewProcedureInfoFormValues;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: NewProcedureInfoFormValues, actions) => {
        const payload = {
          priority: values.priority,
          source: values.source,
          private: values.private,
          deadline: values.deadline,
          requesterId: values.requesterId,
          procedureTemplateId: values.subjectTemplateId
            ? values.subjectTemplateId
            : values.procedureTemplateId,
        };
        onSubmit(payload)
          .then(() => {
            showSnackbar('Novo processo criado com sucesso', 'success');
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
      validationSchema={Yup.object().shape({
        procedureTemplateId: Yup.number().required('Campo obrigatório'),
        requesterId: Yup.number().required('Campo obrigatório'),
      })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {(formik) => (
        <Form>
          <div className="sm:pr-10 px-4 w-full">
            <div className="sm:space-y-8">
              <Typography
                variant="title2"
                family="robotoMedium"
                color="darkGray"
              >
                Dados do processo
              </Typography>
              <div className="sm:flex space-y-4 sm:space-y-0">
                <div className="sm:w-6/12 sm:pr-6">
                  <Typography
                    className="pb-3 pt-3 sm:pt-0"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Grupo de origem*:
                  </Typography>
                  <SelectGroupRequesters
                    groupRequestersId={Number(sessionGroupRequester?.id)}
                  />
                </div>
                <div className="sm:w-6/12">
                  <Typography
                    className="pb-3"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Solicitante*:
                  </Typography>
                  <SelectRequesters name="requesterId" requester={requesters} />
                  <div className="pt-2">
                    {formik.errors.requesterId ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.requesterId}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="sm:flex space-y-4 sm:space-y-0">
                <div className="sm:w-4/12 sm:pr-6">
                  <Typography
                    className="pb-3 pt-3 sm:pt-0"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Visibilidade*:
                  </Typography>
                  <SelectVisibility name="private" />
                </div>
                <div className="sm:w-4/12 sm:pr-6">
                  <Typography
                    className="pb-3"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Prazo:
                  </Typography>
                  <Input
                    name="deadline"
                    type="date"
                    onChange={formik.handleChange}
                    value={formik.values.deadline}
                    w="full"
                    size="md"
                  />
                </div>
                <div className="sm:w-4/12">
                  <Typography
                    className="pb-3"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Prioridade:
                  </Typography>
                  <SelectPriority name="priority" />
                </div>
              </div>
              <div className="sm:flex space-y-4 sm:space-y-0">
                <div className="sm:w-6/12 sm:pr-6">
                  <Typography
                    className="pb-3 pt-3 sm:pt-0"
                    variant="footnote1"
                    family="robotoMedium"
                  >
                    Tipo de processo*:
                  </Typography>
                  <SelectProcedureTemplates
                    name="procedureTemplateId"
                    procedureTemplates={procedureTemplates}
                    setKey={setKey}
                  />
                  <div className="pt-2">
                    {formik.errors.procedureTemplateId ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.procedureTemplateId}
                      </Typography>
                    ) : null}
                  </div>
                </div>
                {formik.values.procedureTemplateId && (
                  <div className="sm:w-6/12">
                    <Typography
                      className="pb-3"
                      variant="footnote1"
                      family="robotoMedium"
                    >
                      Assunto do tipo de processo:
                    </Typography>
                    <SelectSubjects
                      name="subjectTemplateId"
                      parentProcedureTemplateId={
                        formik.values.procedureTemplateId
                      }
                      subjects={procedureTemplates}
                      key={key}
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 sm:w-1/2">
                {formik.values.procedureTemplateId && (
                  <>
                    <Typography
                      className="pb-2"
                      variant="footnote1"
                      family="robotoMedium"
                    >
                      Anexos
                    </Typography>
                    <ShowAttachment
                      procedureTemplateId={Number(
                        formik.values.procedureTemplateId
                      )}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="pt-10 pb-8 flex justify-between">
              <Button
                color="error"
                type="button"
                label="Cancelar"
                onClick={() => router.push(`/printer-flow/procedures`)}
              />
              <Button
                disabled={formik.isSubmitting}
                type="submit"
                color="info"
                label="Continuar"
              />
            </div>
            <div className="mt-6">
              {formik.values.procedureTemplateId && (
                <FieldsPreview
                  procedureTemplateId={
                    formik.values.subjectTemplateId
                      ? formik.values.subjectTemplateId
                      : formik.values.procedureTemplateId
                  }
                />
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewProcedureInfo;
