import * as React from 'react';
import router from 'next/router';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button, Input, Typography } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { EditProps, EditPolicyFormValues } from './types';
import AppsRadioGroup from '../../../../PrinterCloud/Apps/RadioGroup';
import PolicyEffectsRadioGroup from '../../../../PrinterCloud/Policies/Effects/RadioGroup/RadioGroup';
import PolicyActionsCheckboxGroup from '../../../../PrinterCloud/PolicyActions/CheckboxGroup';
import PrnFieldArray from '../../../../PrinterCloud/Prns/FieldArray';

const Edit = ({ policy, onSubmit }: EditProps) => {
  const { session } = useSession();

  const initialValues: EditPolicyFormValues = {
    name: policy.name,
    description: policy.description,
    service: policy.service,
    effect: policy.effect,
    actionIds: policy.actions.map((action) => action.id.toString()),
    resource: policy.resource,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        description: Yup.string().required('Campo obrigatório'),
        service: Yup.string().required('Campo obrigatório'),
        effect: Yup.string().required('Escolha uma das opções'),
        actionIds: Yup.array().min(1, 'Selecione ao menos uma opção'),
        resource: Yup.array().min(1, 'Preencha ao menos uma opção'),
      })}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {(formik) => (
        <Form>
          <div className="pt-12">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              Nome da permissão:
            </Typography>
            <Input
              size="md"
              w="full"
              value={policy.name}
              disabled
              onChange={() => {}}
            />
          </div>
          <div className="pt-12 sm:pt-7">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              Descrição da permissão:
            </Typography>
            <Input
              size="md"
              w="full"
              onChange={formik.handleChange}
              value={formik.values.description}
              name="description"
            />
            {formik.touched.description && formik.errors.description ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.description}
              </Typography>
            ) : null}
          </div>
          <div className="pt-12 sm:pt-7">
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
            <div className="pt-12 sm:pt-7">
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
            <div className="pt-12 sm:pt-7">
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
          {formik.values.actionIds && (
            <div className="pt-12 sm:pt-7">
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
          <div className="flex justify-between pt-8">
            <Button
              type="button"
              label="Cancelar"
              color="error"
              onClick={() =>
                router.push(`/printer-cloud/policies/${policy.id}`)
              }
            />
            <Button
              type="submit"
              label="Salvar alterações"
              color="info"
              disabled={false}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Edit;
