import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { ButtonV3 as Button, TypographyV3 as Typography } from 'printer-ui';
import { useSession, useV3Snackbar } from '../../hooks';
import { NewProcedureFieldsProps, UpdateProcedureFormValues } from './types';
import { noEmojiValidator } from '../../utils';
import FieldTypes from '../components/Procedures/FieldTypes/New';
import Info from '../components/Procedures/Info';
import ProcedureFieldsEmpty from './Empty';

const NewProcedureFields = ({
  handleSubmit,
  procedure,
}: NewProcedureFieldsProps) => {
  const { session, themeColor } = useSession();
  const { showV3Snackbar } = useV3Snackbar();
  const [disableSubmitButton, setDisableSubmitButton] =
    React.useState<boolean>(false);

  if (!session) return null;

  const initialValues = {
    payload: procedure.schema.map((schemaItem) => {
      if (
        schemaItem.fieldType === 'attachment' ||
        schemaItem.fieldType === 'checkbox'
      )
        return { ...schemaItem, value: [] };
      else return { ...schemaItem, value: '' };
    }),
  };

  return (
    <div className="w-full my-4 sm:pr-10 sm:pl-20 px-4">
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
              .then((res) => {
                router.push(
                  `/flow-cidadao/procedures/new/${res.id}/review-procedure`
                );
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
                  Preencha os campos do processo:
                </Typography>
              </div>
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-1 gap-6">
                {formik.values.payload.map((field, index) => {
                  return (
                    <FieldTypes
                      activeStep={2}
                      disabled={false}
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
              </div>
              <div
                className={`sm:justify-start justify-center flex border-t-2 border-${themeColor}`}
              >
                <Button
                  type="submit"
                  label="Enviar"
                  className="my-4"
                  w={48}
                  color={themeColor}
                  disabled={
                    formik.isSubmitting
                      ? formik.isSubmitting
                      : disableSubmitButton
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewProcedureFields;
