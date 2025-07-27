import * as React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button, Input, Typography } from 'printer-ui';
import { useSession, useSnackbar } from '../../../hooks';
import { NewPolicyProps, NewPolicyFormValues } from './types';
import AppsRadioGroup from '../../Apps/RadioGroup';
import PolicyEffectsRadioGroup from '../Effects/RadioGroup';
import PolicyActionsCheckboxGroup from '../../PolicyActions/CheckboxGroup';
import PrnFieldArray from '../../Prns/FieldArray';

const NewPolicy = ({ onSubmit }: NewPolicyProps) => {
  const { showSnackbar } = useSnackbar();
  const { session } = useSession();

  const initialValues: NewPolicyFormValues = {
    name: '',
    description: '',
    service: '',
    effect: '',
    resource: [],
  } as NewPolicyFormValues;

  if (!session) return null;

  return (
    <div className="sm:w-[28.925rem] px-4 sm:pl-0">
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required('Campo obrigatório')
            .matches(/^[^*]+$/, 'Nome não pode conter "*"'),
          description: Yup.string().required('Campo obrigatório'),
          service: Yup.string().required('Campo obrigatório'),
          effect: Yup.string().required('Escolha uma das opções'),
          actionIds: Yup.array().min(1, 'Selecione ao menos uma opção'),
          resource: Yup.array().min(1, 'Preencha ao menos uma opção'),
        })}
        onSubmit={(values, actions) => {
          onSubmit(values)
            .then((response) => {
              showSnackbar('Permissão criada com sucesso', 'success');
              router.push(`/printer-cloud/policies/${response.id}`);
            })
            .catch((error) => {
              showSnackbar(error.response.data.message, 'error');
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {(formik) => (
          <Form>
            <div className="pt-7">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="pb-2"
              >
                Qual vai ser o nome da permissão?
              </Typography>
              <Input
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                size="md"
                w="full"
                placeholder="Digite o nome"
              />
              {formik.touched.name && formik.errors.name ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.name}
                </Typography>
              ) : null}
            </div>
            <div className="pt-7">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="pb-2"
              >
                Descrição da permissão:
              </Typography>
              <Input
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                size="md"
                w="full"
                placeholder="Digite a descrição"
              />
              {formik.touched.description && formik.errors.description ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.description}
                </Typography>
              ) : null}
            </div>
            <div className="pt-7">
              <Typography
                variant="footnote1"
                family="robotoMedium"
                className="pb-2"
              >
                Aplicativos
              </Typography>
              <Typography variant="footnote2" className="pb-2">
                Escolha a qual aplicativo o usuário terá acesso:
              </Typography>
              <AppsRadioGroup />
              {formik.touched.service && formik.errors.service ? (
                <Typography variant="footnote2" color="error">
                  * {formik.errors.service}
                </Typography>
              ) : null}
            </div>
            {formik.values.service && (
              <div className="pt-7">
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="pb-2"
                >
                  Efeito
                </Typography>
                <Typography variant="footnote2" className="pb-2">
                  Escolha o efeito desejado:
                </Typography>
                <PolicyEffectsRadioGroup />
                {formik.touched.effect && formik.errors.effect ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.effect}
                  </Typography>
                ) : null}
              </div>
            )}
            {formik.values.effect && (
              <div className="pt-7">
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="pb-2"
                >
                  Ações
                </Typography>
                <Typography variant="footnote2" className="pb-2">
                  Escolha a(s) ação(ões) desejadas:
                </Typography>
                <PolicyActionsCheckboxGroup service={formik.values.service} />
                {formik.touched.actionIds && formik.errors.actionIds ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.actionIds}
                  </Typography>
                ) : null}
              </div>
            )}
            {formik.values.actionIds && formik.values.service && (
              <div className="pt-7">
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="pb-2"
                >
                  Instruções:
                </Typography>
                <Typography
                  className="w-full text-end sm:text-start mb-4"
                  variant="footnote1"
                >
                  Para criar a permissão você deve seguir os exemplos abaixo:
                </Typography>
                <Typography
                  className="w-full text-end sm:text-start mb-4"
                  variant="footnote1"
                  color="gray"
                >
                  Ex 1: prn:printer_cloud:{session?.organization?.cnpj}
                  :user/john.doe
                </Typography>
                <Typography
                  color="gray"
                  className="w-full text-end sm:text-start mb-4"
                  variant="footnote1"
                >
                  Ex 2: prn:printer_air:{session?.organization?.cnpj}
                  :Meu Air/Administração/*
                </Typography>
                <Typography
                  color="gray"
                  className="w-full text-end sm:text-start mb-4"
                  variant="footnote1"
                >
                  Ex 3: prn:printer_flow{session?.organization?.cnpj}
                  :requester_internal/*
                </Typography>
                <Typography
                  variant="footnote1"
                  family="robotoMedium"
                  className="pb-2"
                >
                  Recursos
                </Typography>
                <PrnFieldArray />
                {formik.touched.resource && formik.errors.resource ? (
                  <Typography variant="footnote2" color="error">
                    * {formik.errors.resource}
                  </Typography>
                ) : null}
              </div>
            )}
            <div className="flex pt-7 items-center justify-between space-x-2">
              <Button
                label="Cancelar"
                color="red"
                type="button"
                onClick={() => router.push('/printer-cloud/policies')}
              />
              <Button
                label="Criar Permissão"
                color="info"
                type="submit"
                disabled={formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewPolicy;
