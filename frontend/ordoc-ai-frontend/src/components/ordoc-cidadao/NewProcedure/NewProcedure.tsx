'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalProcedureProps } from './types';
import ProcedureTemplateSelect from './Select/ProcedureTemplate';
import ProcedureInfoPreview from './ProcedureInfoPreview';
import ExternalFieldsPreview from './FieldsPreview';
import SubjectSelect from './Select/Subject';
import ProcedureCheckbox from './Checkbox';

const NewExternalProcedures = ({ onSubmit }: ExternalProcedureProps) => {
  const router = useRouter();
  const [error, setError] = React.useState<string>('');

  const initialValues = {
    procedureTemplateId: {} as number,
    subjectTemplateId: null,
    checkbox: false,
  };

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Novo Processo</CardTitle>
          <CardDescription>
            Você está criando um novo processo no Flow Cidadão. Comece
            preenchendo os dois campos abaixo para visualizar seu modelo de
            formulário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              setError('');
              
              onSubmit({ procedureTemplateId: Number(values.subjectTemplateId) })
                .then((res) => {
                  router.push(
                    `/ordoc-cidadao/procedures/new/${res.id}/complete-procedure`
                  );
                })
                .catch((err) => {
                  const errorMessage = err.response?.data?.message || 'Erro ao criar procedimento';
                  setError(errorMessage);
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
              <Form className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <ProcedureTemplateSelect
                      formik={formik}
                      name="procedureTemplateId"
                    />
                    {formik.errors.procedureTemplateId && (
                      <p className="text-sm text-red-500 mt-1">
                        * {formik.errors.procedureTemplateId}
                      </p>
                    )}
                  </div>

                  <div>
                    <SubjectSelect
                      name="procedureTemplateId"
                      formik={formik}
                      parentProcedureTemplateId={Number(
                        formik.values.procedureTemplateId
                      )}
                    />
                    {formik.errors.subjectTemplateId && (
                      <p className="text-sm text-red-500 mt-1">
                        * {formik.errors.subjectTemplateId}
                      </p>
                    )}
                  </div>

                  {formik.values.subjectTemplateId && (
                    <ProcedureInfoPreview
                      formik={formik}
                      procedureTemplateId={formik.values.procedureTemplateId}
                      subjectId={formik.values.subjectTemplateId}
                    />
                  )}

                  {formik.values.subjectTemplateId && (
                    <ExternalFieldsPreview
                      procedureTemplateId={formik.values.subjectTemplateId}
                      formik={formik}
                    />
                  )}

                  {formik.values.subjectTemplateId && (
                    <ProcedureCheckbox formik={formik} />
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/ordoc-cidadao/procedures')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formik.values.checkbox || formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewExternalProcedures;
