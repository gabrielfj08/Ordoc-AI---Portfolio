import * as React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useSnackbar } from '../../../../hooks';
import FieldTypes from '../../../components/Procedures/FieldTypes';
import { ProcedureFieldsProps } from './types';
import FieldsEmpty from './Empty';

const ProcedureFields = ({
  procedure,
  fields,
  onSubmit,
}: ProcedureFieldsProps) => {
  const { showSnackbar } = useSnackbar();

  if (!fields.length) {
    return <FieldsEmpty procedure={procedure} />;
  }

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
    <div className="w-screen sm:w-full px-4 space-y-8 sm:pr-10">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              router.push(
                `/printer-flow/group-requesters/${procedure.responsibleGroupId}/procedures/${procedure.id}`
              );
              showSnackbar('Campos do processo salvos com sucesso', 'success');
            })
            .catch((error) =>
              showSnackbar(error.response.data.message, 'error')
            )
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
          <Form>
            <div className="py-8">
              <Typography family="robotoMedium">Campos do Processo</Typography>
            </div>
            <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 gap-8">
              {formik.values.payload.map((field, index) => {
                return (
                  <div key={field.label} className="space-y-2">
                    <Typography family="robotoMedium" variant="footnote1">
                      {field.label}:
                    </Typography>
                    <FieldTypes
                      formik={formik}
                      type={field.fieldType}
                      fieldName={`payload[${index}].value`}
                      label={field.label}
                      options={field.options}
                      value={field.value}
                      procedure={procedure}
                      index={index}
                    />
                  </div>
                );
              })}
            </div>
            <div className="my-8 w-full flex justify-end">
              <span className="hidden sm:block">
                <Button
                  label="Salvar campos do processo"
                  type="submit"
                  color="info"
                  disabled={formik.isSubmitting}
                />
              </span>
              <span className="sm:hidden">
                <Button
                  label="Salvar"
                  type="submit"
                  color="info"
                  disabled={formik.isSubmitting}
                />
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProcedureFields;
