import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { Typography, Input, Button } from 'printer-ui';
import { useSnackbar } from '../../../hooks';
import { EditTaskTemplateProps, EditTaskTemplateFormValues } from './types';

const EditTaskTemplate = ({
  taskTemplate,
  onSubmit,
}: EditTaskTemplateProps) => {
  const { showSnackbar } = useSnackbar();

  const initialValues: EditTaskTemplateFormValues = {
    name: taskTemplate.name,
    description: taskTemplate.description,
  };

  return (
    <div className="lg:w-6/12 lg:px-0 px-4 w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then((result) => {
              router.push(`/printer-flow/task-templates/${result.id}`);
              showSnackbar('Alterações salvas com sucesso', 'success');
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
          description: Yup.string().required('Campo obrigatório'),
        })}
      >
        {(formik) => (
          <Form>
            <div className="space-y-8">
              <div className="space-y-2">
                <Typography variant="footnote1" family="robotoMedium">
                  Nome do tipo de tarefa*:
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
                  Descrição*:
                </Typography>
                <Input
                  w="full"
                  size="md"
                  type="text"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.description}
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
                      `/printer-flow/task-templates/${router.query.taskTemplateId}`
                    )
                  }
                />
                <Button
                  type="submit"
                  color="info"
                  label="Salvar alterações"
                  disabled={
                    formik.isSubmitting || taskTemplate.status === 'inactive'
                  }
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTaskTemplate;
