import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import router from 'next/router';
import { Button, Input, Typography } from 'printer-ui';
import { useSnackbar } from '../../../../hooks';
import { EditSubjectFormValues, EditSubjectProps } from './types';
import SelectGroup from './../../../components/SelectGroupRequester';
import { queryClient } from '../../../../queryClient';

const EditSubject = ({
  data,
  parentProcedureTemplate,
  onSubmit,
}: EditSubjectProps) => {
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

  const initialValues: EditSubjectFormValues = {
    name: data.name,
    source: dataSource(data.source),
    groupRequesterId: data.groupRequesterId ? data.groupRequesterId : null,
  };

  const SourceField = () => {
    switch (parentProcedureTemplate.source) {
      case 'internal':
        return (
          <div className="flex space-x-6">
            <div className="flex space-x-2">
              <Field
                id="internal"
                type="checkbox"
                name="source"
                value="internal"
                checked
              />
              <label htmlFor="internal">
                <Typography variant="footnote1" family="robotoMedium">
                  Interno
                </Typography>
              </label>
            </div>
            <div className="flex space-x-2">
              <input type="checkbox" disabled />
              <label>
                <Typography variant="footnote1" family="robotoMedium">
                  Externo
                </Typography>
              </label>
            </div>
          </div>
        );
      case 'external':
        return (
          <div className="flex space-x-6">
            <div className="flex space-x-2">
              <input type="checkbox" disabled />
              <label>
                <Typography variant="footnote1" family="robotoMedium">
                  Interno
                </Typography>
              </label>
              <div className="flex space-x-2">
                <Field
                  id="external"
                  type="checkbox"
                  name="source"
                  value="external"
                  checked
                />
                <label htmlFor="external">
                  <Typography variant="footnote1" family="robotoMedium">
                    Externo
                  </Typography>
                </label>
              </div>
            </div>
          </div>
        );
      case 'internal_external':
        return (
          <div className="flex space-x-6">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mb-12">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then(() => {
              router.push(
                `/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${data.id}`
              );
              queryClient.invalidateQueries(['procedureTemplates']);
              showSnackbar(
                'Dados do assunto atualizados com sucesso.',
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
          groupRequesterId: Yup.number()
            .nullable(true)
            .when('source', {
              is: (source) => source.includes('external'),
              then: Yup.number().nullable(true).required('Campo obrigatório'),
            }),
          source: Yup.array().min(1, 'Selecione ao menos uma opção'),
        })}
      >
        {(formik) => (
          <Form>
            <div className="my-6 sm:w-6/12 w-full px-4 h-96">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="py-4"
              >
                Nome do assunto:*
              </Typography>
              <Input
                type="text"
                id="name"
                name="name"
                size="md"
                w="full"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.name}
                </Typography>
              ) : null}
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="py-4"
              >
                Grupo responsável:{data.source !== 'internal' && '*'}
              </Typography>
              <SelectGroup
                name="groupRequesterId"
                initialValue={data.groupRequester?.name}
              />
              {formik.touched.groupRequesterId &&
              formik.errors.groupRequesterId ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.groupRequesterId}
                </Typography>
              ) : null}
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="py-4"
              >
                Visualização de assunto:
              </Typography>
              <SourceField />
              {formik.touched.source && formik.errors.source ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.source}
                </Typography>
              ) : null}
              <div className="flex justify-between items-center space-x-2 pt-4">
                <Button
                  type="button"
                  color="error"
                  label="Cancelar"
                  onClick={() =>
                    router.push(
                      `/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${router.query.id}`
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

export default EditSubject;
