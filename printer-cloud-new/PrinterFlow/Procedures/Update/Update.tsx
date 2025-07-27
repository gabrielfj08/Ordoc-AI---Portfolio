import React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../utils';
import { useModal, useSnackbar } from '../../../hooks';
import {
  UpdateProcedureFieldsProps,
  UpdateProcedureFieldsFormValues,
} from './types';
import UpdateFieldTypes from '../../components/Procedures/UpdateFieldTypes';

const UpdateProcedureFields = ({
  procedure,
  onSubmit,
  setEdit,
}: UpdateProcedureFieldsProps) => {
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();

  return (
    <div className="w-screen sm:w-full px-4 space-y-8 sm:pr-10">
      <Formik
        initialValues={
          {
            payload: procedure.payload,
          } as UpdateProcedureFieldsFormValues
        }
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              closeModal();
              setEdit(false);
              router.push(
                `/printer-flow/group-requesters/${procedure.responsibleGroupId}/procedures/${procedure.id}`
              );
              showSnackbar(`Alterações salvas com sucesso.`, 'success');
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
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
                    <UpdateFieldTypes
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
            <div className="mt-8 mb-4 w-full flex justify-end">
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

export default UpdateProcedureFields;
