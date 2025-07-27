import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useSession, useV3Snackbar } from '../../hooks';
import { ButtonV3 as Button, TypographyV3 as Typography } from 'printer-ui';
import { noEmojiValidator } from '../../utils';
import { ReviewProcedureFieldsProps, UpdateProcedureFormValues } from './types';
import FieldTypes from '../components/Procedures/FieldTypes/Upload';
import ProcedureFieldsEmpty from '../NewProcedureFields/Empty';
import Info from '../components/Procedures/Info';

const ReviewProcedureFields = ({
  procedure,
  handleSubmit,
  handleRunProcedure,
}: ReviewProcedureFieldsProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { session, themeColor } = useSession();
  const [isEditEnabled, enabledEdit] = React.useState<boolean>(false);
  const [disableSubmitButton, setDisableSubmitButton] =
    React.useState<boolean>(false);

  if (!session) return null;

  const initialValues = {
    payload: procedure.payload,
  };

  return (
    <div className={'w-full my-4 sm:pr-10 sm:pl-20 px-4'}>
      <div className={`space-y-1 py-3 border-y-2 border-${themeColor}`}>
        <Info
          color={themeColor}
          title="Solicitante:"
          content={procedure.requester.name}
        />
        <Info
          color={themeColor}
          title="Tipo de processo:"
          content={procedure.parentProcedureTemplateName}
        />
        <Info
          color={themeColor}
          title="Assunto do processo:"
          content={procedure.procedureTemplateName}
        />
        <Info
          color={themeColor}
          title="Grupo responsável:"
          content={procedure.responsibleGroup.name}
        />
      </div>
      <div className="py-4">
        <Formik
          key={procedure.id}
          initialValues={initialValues}
          onSubmit={(values: UpdateProcedureFormValues, actions) => {
            handleSubmit(values)
              .then(() => {
                enabledEdit(false);
              })
              .catch((err) => {
                showV3Snackbar(
                  `${err.response.data.message}`,
                  'error',
                  'Algo deu errado!'
                );
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
          enableReinitialize
          validationSchema={Yup.object().shape({
            payload: Yup.array().of(
              Yup.object().shape({
                value: Yup.lazy((value) => {
                  if (Array.isArray(value)) {
                    return Yup.array().min(1, 'Selecione ao menos uma opção');
                  } else {
                    return Yup.mixed()
                      .required('Campo obrigatório')
                      .test(
                        'regex',
                        'Não utilize emojis (desenhos ou pictogramas).',
                        noEmojiValidator
                      );
                  }
                }),
              })
            ),
          })}
        >
          {(formik) => (
            <Form className="space-y-4">
              <div className="flex justify-between items-center">
                <Typography
                  variant="bodyLg"
                  family="jakartaBold"
                  color={themeColor}
                >
                  Revise as informações dos campos e finalize o processo:
                </Typography>
                {isEditEnabled ? null : (
                  <Button
                    label="Editar campos"
                    type="button"
                    color={themeColor}
                    disabled={
                      formik.values.payload.length === 0 || formik.isSubmitting
                    }
                    onClick={() => enabledEdit(true)}
                  />
                )}
              </div>
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-1 gap-6">
                {formik.values.payload.map((field, index) => {
                  return (
                    <FieldTypes
                      activeStep={3}
                      disabled={!isEditEnabled}
                      key={index}
                      color={themeColor}
                      formik={formik}
                      type={field.fieldType}
                      fieldName={`payload[${index}].value`}
                      label={field.label}
                      value={field.value}
                      procedure={procedure}
                      options={field.options}
                      index={index}
                      setDisableSubmitButton={setDisableSubmitButton}
                    />
                  );
                })}
                {formik.values.payload.length > 0 ? null : (
                  <ProcedureFieldsEmpty />
                )}
                {isEditEnabled ? (
                  <Button
                    label="Salvar campos"
                    type="submit"
                    color={themeColor}
                    disabled={
                      formik.isSubmitting
                        ? formik.isSubmitting
                        : disableSubmitButton
                    }
                  />
                ) : null}
              </div>
              <div
                className={`sm:justify-start justify-center flex border-t-2 border-${themeColor}`}
              >
                <Button
                  type="button"
                  label="Finalizar"
                  className="my-4"
                  w={48}
                  color={themeColor}
                  disabled={isEditEnabled}
                  onClick={() => handleRunProcedure()}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewProcedureFields;
