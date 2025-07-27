import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import { Form, Formik } from 'formik';
import { ButtonV3 as Button, TypographyV3 as Typography } from 'printer-ui';
import { useSession, useV3Snackbar } from '../../hooks';
import { ExternalProcedureProps } from './types';
import ProcedureTemplateSelect from './Select/ProcedureTemplate';
import ProcedureInfoPreview from './ProcedureInfoPreview';
import ExternalFieldsPreview from './FieldsPreview';
import SubjectSelect from './Select/Subject';
import ProcedureCheckbox from './Checkbox';

const NewExternalProcedures = ({ onSubmit }: ExternalProcedureProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const { session, themeColor } = useSession();

  const initialValues = {
    procedureTemplateId: {} as number,
    subjectTemplateId: null,
    checkbox: false,
  };

  if (!session) return null;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit({ procedureTemplateId: Number(values.subjectTemplateId) })
          .then((res) => {
            router.push(
              `/flow-cidadao/procedures/new/${res.id}/complete-procedure`
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
      validationSchema={Yup.object().shape({
        procedureTemplateId: Yup.number().required('Campo obrigatório'),
        subjectTemplateId: Yup.number().required('Campo obrigatório'),
        checkbox: Yup.bool().oneOf(
          [true],
          'Marque a caixa acima para prosseguir'
        ),
      })}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formik) => (
        <Form>
          <div className="w-full sm:my-4 sm:pr-10 sm:pl-20 px-4">
            <div
              className={`sm:h-16 h-20 flex items-center border-${themeColor} border-b-2`}
            >
              <Typography
                variant="headline5"
                family="jakarta"
                color={themeColor}
                align="start mt-4 sm:pt-0"
              >
                Você está criando um novo processo no Flow Cidadão. Comece
                preenchendo os dois campos abaixo para visualizar seu modelo de
                formulário.
              </Typography>
            </div>
            <div className="w-full h-screen my-6 space-y-4">
              <div className="w-full">
                <ProcedureTemplateSelect
                  formik={formik}
                  name="procedureTemplateId"
                />
                {formik.errors.procedureTemplateId ? (
                  <Typography family="jakarta" variant="label" color="error">
                    * {formik.errors.procedureTemplateId}
                  </Typography>
                ) : null}
              </div>
              <div className="w-full">
                <SubjectSelect
                  name="procedureTemplateId"
                  formik={formik}
                  parentProcedureTemplateId={Number(
                    formik.values.procedureTemplateId
                  )}
                />
                {formik.errors.subjectTemplateId ? (
                  <Typography family="jakarta" variant="label" color="error">
                    * {formik.errors.subjectTemplateId}
                  </Typography>
                ) : null}
              </div>
              {formik.values.subjectTemplateId ? (
                <ProcedureInfoPreview
                  formik={formik}
                  procedureTemplateId={formik.values.procedureTemplateId}
                  subjectId={formik.values.subjectTemplateId}
                />
              ) : null}
              <div className="mt-6">
                {formik.values.subjectTemplateId && (
                  <ExternalFieldsPreview
                    procedureTemplateId={formik.values.subjectTemplateId}
                    formik={formik}
                  />
                )}
              </div>
              <div className="mt-6">
                {formik.values.subjectTemplateId && (
                  <ProcedureCheckbox formik={formik} />
                )}
              </div>
              <div className="w-full sm:flex sm:flex-row-reverse grid items-center justify-center px-8 space-y-6 sm:space-y-0">
                <Button
                  type="submit"
                  color={themeColor}
                  label="Enviar"
                  w={56}
                  disabled={!formik.values.checkbox || formik.isSubmitting}
                />
                <Button
                  w={56}
                  style="outlined"
                  color={themeColor}
                  label="Cancelar"
                  className="sm:mr-6 mr-0"
                  onClick={() => router.push('/flow-cidadao/procedures')}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewExternalProcedures;
