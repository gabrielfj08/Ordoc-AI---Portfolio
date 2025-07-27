import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Field, Form, Formik } from 'formik';
import { useSnackbar } from '../../../hooks';
import { Typography, Input, Button } from 'printer-ui';
import {
  EditProcedureTemplateFormValues,
  EditProcedureTemplateProps,
} from './types';

const EditProcedureTemplate = ({
  onSubmit,
  data,
}: EditProcedureTemplateProps) => {
  const { showSnackbar } = useSnackbar();

  const dataSource = (source: string): Array<string> => {
    if (source.includes('internal') && source.includes('external')) {
      return ['internal', 'external'];
    }

    if (source.includes('external')) {
      return ['external'];
    }

    if (source.includes('internal')) {
      return ['internal'];
    }
    return [data.source];
  };

  const initialValues: EditProcedureTemplateFormValues = {
    name: data.name,
    source: dataSource(data.source),
  };

  return (
    <div className="lg:w-6/12 lg:px-0 px-4 w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then((result) => {
              router.push(`/printer-flow/procedure-templates/${result.id}`);
              showSnackbar(
                'Dados do tipo de processo atualizados com sucesso.',
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
          name: Yup.string().required('Campo obrigatório'),
          source: Yup.array().min(1, 'Selecione ao menos uma opção'),
        })}
      >
        {(formik) => (
          <Form>
            <div className="space-y-8">
              <div className="space-y-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Nome do tipo de processo:*
                </Typography>
                <Input
                  w="full"
                  size="md"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.name}
                  </Typography>
                ) : null}
              </div>
              <div className="space-y-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Visualização do tipo de processo:
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
                    router.push(
                      `/printer-flow/procedure-templates/${router.query.procedureTemplateId}`
                    )
                  }
                />
                <Button
                  type="submit"
                  color="info"
                  label="Salvar alterações"
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

export default EditProcedureTemplate;
