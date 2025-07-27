import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import _ from 'lodash';
import { Tab } from '@headlessui/react';
import { Formik } from 'formik';
import { Button, ButtonRounded, Icon, Input, Typography } from 'printer-ui';
import { ShowPolicyProps, ShowPolicyFormValues } from './types';
import { cnpjMask } from '../../../../utils';
import Layout, { Header } from '../../../Layout';
import AppsRadioGroup from '../../../../PrinterCloud/Apps/RadioGroup';
import PolicyEffectsRadioGroup from '../../../../PrinterCloud/Policies/Effects/RadioGroup';
import PolicyActionsCheckboxGroup from '../../../../PrinterCloud/PolicyActions/CheckboxGroup';
import PoliciesTab from '../../../Tab/PoliciesTab/PoliciesTab';
import PoliciesUsersTab from '../../../Tab/PoliciesTab/PoliciesUsersTab';
import PoliciesUserGroupsTab from '../../../Tab/PoliciesTab/PoliciesUserGroupsTab';
import PrnFieldArray from '../../../../PrinterCloud/Prns/FieldArray';

const ShowPolicy = ({ policy }: ShowPolicyProps) => {
  const initialValues: ShowPolicyFormValues = {
    name: policy.name,
    description: policy.description,
    service: policy.service,
    effect: policy.effect,
    actionIds: policy.actions.map((action) => action.id.toString()),
    resource: policy.resource,
  };

  return (
    <Layout>
      <Head>
        <title>Printer Cloud | Visualizar permissão</title>
      </Head>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 w-full truncate items-center h-full">
          <div className="hidden w-0 sm:block sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/policies`);
              }}
            >
              <Icon
                name="return"
                alt="voltar"
                color="gray"
                w={30}
                h={30}
                fill
                stroke
              />
            </ButtonRounded>
          </div>
          <Icon
            alt="done"
            name="done"
            w={40}
            h={40}
            color="black"
            stroke
          ></Icon>
          <Typography
            family="robotoBold"
            variant="title3"
            className="sm:w-full w-52 sm:truncate-none truncate"
          >
            {policy.name}
          </Typography>
          <div className="justify-end flex items-center sm:w-full">
            <Button
              color="info"
              label="Editar"
              onClick={() =>
                router.push(`/printer-cloud/policies/edit/${policy.id}`)
              }
            />
          </div>
        </div>
      </Header>
      <main className="w-full h-full px-4 flex-col lg:flex-row flex">
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          enableReinitialize
        >
          {(formik) => (
            <div className="w-full h-fit my-5">
              <div className="sm:w-[28.925rem] px-4 sm:pl-0">
                <div>
                  <div className="flex items-center">
                    <Icon
                      className="mr-3"
                      alt="done"
                      name="done"
                      stroke
                      w={30}
                      h={30}
                    />
                    <Typography variant="title2" family="robotoBold">
                      Dados da permissão
                    </Typography>
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center h-7">
                      <Typography
                        className="w-20 sm:w-48"
                        variant="footnote1"
                        family="robotoBold"
                      >
                        Usuários
                      </Typography>
                      <div className="flex w-full items-center justify-end sm:justify-start">
                        <div className="flex items-center justify-end space-x-1">
                          <Typography
                            className="w-full text-end sm:text-start"
                            variant="footnote1"
                          >
                            {policy.usersCount}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="flex h-7 items-center">
                      <Typography
                        className="w-20 sm:w-48"
                        variant="footnote1"
                        family="robotoBold"
                      >
                        Grupos
                      </Typography>
                      <Typography
                        className="w-full text-end sm:text-start"
                        variant="footnote1"
                      >
                        {policy.userGroupsCount}
                      </Typography>
                    </div>
                    <div className="flex h-7 items-center">
                      <Typography
                        className="w-20 sm:w-48"
                        variant="footnote1"
                        family="robotoBold"
                      >
                        Criado
                      </Typography>
                      <Typography
                        className="w-full text-end sm:text-start"
                        variant="footnote1"
                      >
                        {new Date(
                          Date.parse(policy.createdAt)
                        ).toLocaleDateString('pt-br')}{' '}
                        às{' '}
                        {new Date(
                          Date.parse(policy.createdAt)
                        ).toLocaleTimeString('pt-br')}
                      </Typography>
                    </div>
                    <div className="flex h-7 items-center">
                      <Typography
                        className="w-20 sm:w-48"
                        variant="footnote1"
                        family="robotoBold"
                      >
                        Modificado
                      </Typography>
                      <Typography
                        className="w-full text-end sm:text-start"
                        variant="footnote1"
                      >
                        {new Date(
                          Date.parse(policy.updatedAt)
                        ).toLocaleDateString('pt-br')}{' '}
                        às{' '}
                        {new Date(
                          Date.parse(policy.updatedAt)
                        ).toLocaleTimeString('pt-br')}
                      </Typography>
                    </div>
                    <div className="space-y-3 pt-6">
                      <Typography variant="footnote1" family="robotoBold">
                        A qual instituição a permissão pertence:
                      </Typography>
                      <Input
                        className="truncate"
                        disabled
                        onChange={() => {}}
                        value={`${cnpjMask(policy.organization.cnpj)} - ${
                          policy.organization.corporateName
                        }`}
                        size="md"
                        w="full"
                      />
                      <div className="space-y-3 pt-3">
                        <Typography variant="footnote1" family="robotoBold">
                          Nome da permissão:
                        </Typography>
                        <Input
                          className="truncate"
                          disabled
                          onChange={() => {}}
                          value={policy.name}
                          size="md"
                          w="full"
                        />
                      </div>
                      <div className="space-y-3 pt-3">
                        <Typography variant="footnote1" family="robotoBold">
                          Descrição da permissão:
                        </Typography>
                        <Input
                          className="truncate"
                          disabled
                          onChange={() => {}}
                          value={policy.description}
                          size="md"
                          w="full"
                        />
                      </div>
                      <div className="pt-12 sm:pt-7">
                        <Typography
                          variant="footnote1"
                          family="robotoMedium"
                          className="pb-2"
                        >
                          Aplicativos
                        </Typography>
                        <AppsRadioGroup disabled />
                      </div>
                      <div className="pt-12 sm:pt-7">
                        <Typography
                          variant="footnote1"
                          family="robotoMedium"
                          className="pb-2"
                        >
                          Efeito
                        </Typography>
                        <PolicyEffectsRadioGroup disabled />
                      </div>
                      <div className="pt-12 sm:pt-7">
                        <Typography
                          variant="footnote1"
                          family="robotoMedium"
                          className="pb-2"
                        >
                          Ações
                        </Typography>
                        <PolicyActionsCheckboxGroup
                          service={formik.values.service}
                          disabled
                        />
                      </div>
                      <div className="pt-12 sm:pt-7">
                        <Typography
                          variant="footnote1"
                          family="robotoMedium"
                          className="pb-2"
                        >
                          Recursos
                        </Typography>
                        <PrnFieldArray resource={policy.resource} disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
        <div className="w-full h-fit mt-5">
          <PoliciesTab>
            <Tab.Panels className="rounded-lg h-full w-full">
              <PoliciesUsersTab policy={policy} />
              <PoliciesUserGroupsTab policy={policy} />
            </Tab.Panels>
          </PoliciesTab>
        </div>
      </main>
    </Layout>
  );
};

export default ShowPolicy;
