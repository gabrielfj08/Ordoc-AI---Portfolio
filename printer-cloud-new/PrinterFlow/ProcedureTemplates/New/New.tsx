import * as React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import { Form, Formik, Field } from 'formik';
import { Typography, Input, Button } from 'printer-ui';
import { noEmojiValidator } from '../../../utils';
import { useSnackbar } from '../../../hooks';
import {
  NewProcedureTemplateProps,
  NewProcedureTemplateFormValues,
} from './types';

const NewProcedureTemplate = ({ onSubmit }: NewProcedureTemplateProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: '',
    source: [],
  } as NewProcedureTemplateFormValues;

  return (
    <div className="lg:w-6/12 lg:px-0 px-4 w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then((result) => {
              router.push(`/printer-flow/procedure-templates/${result.id}`);
              showSnackbar(
                'Novo tipo de processo criado com sucesso',
                'success'
              );
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
          name: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          source: Yup.array().min(1, 'Selecione ao menos uma opção'),
        })}
      >
        {(formik) => (
          <Form>
            <div className="space-y-8">
              <div className="space-y-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Nome do tipo de processo*:
                </Typography>
                <Input
                  w="full"
                  size="md"
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.name}
                  </Typography>
                ) : null}
              </div>
              <div className="space-y-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Visualização do tipo de processo*:
                </Typography>
                <div className="flex space-x-4 justify-start items-center">
                  <div className="flex space-x-2">
                    <Field
                      id="internal"
                      type="checkbox"
                      name="source"
                      value="internal"
                    />
                    <label htmlFor="internal" className="cursor-pointer">
                      <Typography variant="footnote1" family="robotoMedium">
                        Interno
                      </Typography>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <Field
                      id="external"
                      type="checkbox"
                      name="source"
                      value="external"
                    />
                    <label htmlFor="external" className="cursor-pointer">
                      <Typography variant="footnote1" family="robotoMedium">
                        Externo
                      </Typography>
                    </label>
                  </div>
                </div>
                {formik.touched.source && formik.errors.source ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.source}
                  </Typography>
                ) : null}
              </div>
              <div className="flex justify-between items-center space-x-2">
                <Button
                  type="button"
                  color="error"
                  label="Cancelar"
                  onClick={() =>
                    router.push(`/printer-flow/procedure-templates`)
                  }
                />
                <Button
                  type="submit"
                  color="info"
                  label="Criar tipo de processo"
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewProcedureTemplate;
