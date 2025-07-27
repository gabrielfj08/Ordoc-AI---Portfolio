import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import Layout, { Header } from '../../../../components/Layout';
import Edit from '../../../../components/PrinterCloud/Policies/Edit';
import EditPolicySkeleton from '../../../../components/PrinterCloud/Policies/Edit/Skeleton';

const EditPolicy = () => {
  if (!router.query.policyId) {
    return <EditPolicySkeleton />;
  }

  return (
    <>
      <Head>
        <title>Printer Cloud | Editar permissão</title>
      </Head>
      <Layout>
        <Header>
          <div className="pt-5 sm:pl-4 sm:pt-0 flex space-x-4">
            <div className="hidden w-0 sm:flex sm:w-fit">
              <ButtonRounded
                onClick={() => {
                  router.push(
                    `/printer-cloud/policies/${router.query.policyId}`
                  );
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
            <Typography variant="title3" family="robotoBold">
              Editar permissão
            </Typography>
          </div>
        </Header>
        <main>
          <Edit policyId={Number(router.query.policyId)} />
        </main>
      </Layout>
    </>
  );
};

export default EditPolicy;
