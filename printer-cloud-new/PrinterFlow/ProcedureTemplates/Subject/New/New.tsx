import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik, Field } from 'formik';
import router from 'next/router';
import { Button, Input, Typography } from 'printer-ui';
import { noEmojiValidator } from '../../../../utils';
import { useSnackbar } from '../../../../hooks';
import { NewSubjectProps, NewSubjectFormValues } from './types';
import SelectGroup from '../../../components/SelectGroupRequester';

const NewSubject = ({
  onSubmit,
  parentProcedureTemplateId,
  source,
}: NewSubjectProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    name: '',
    groupRequesterId: null,
    parentProcedureTemplateId: parentProcedureTemplateId,
    source: source === 'external' || source === 'internal' ? [source] : [],
  } as NewSubjectFormValues;

  const SourceField = () => {
    switch (source) {
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
            .then((res) => {
              router.push(
                `/printer-flow/procedure-templates/${parentProcedureTemplateId}/subjects/${res.id}`
              );
              showSnackbar('Novo assunto criado com sucesso', 'success');
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
                Nome do novo assunto:*
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
                Grupo responsável:{source === 'external' && '*'}
              </Typography>

              <SelectGroup name="groupRequesterId" />

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
                      `/printer-flow/procedure-templates/${parentProcedureTemplateId}`
                    )
                  }
                />
                <Button
                  type="submit"
                  color="info"
                  label="Criar assunto"
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

export default NewSubject;
