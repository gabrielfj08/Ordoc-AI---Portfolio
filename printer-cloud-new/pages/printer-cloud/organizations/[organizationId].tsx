import * as React from 'react';
import router from 'next/router';
import Layout from '../../../components/Layout';
import ShowOrganizationContainer from '../../../PrinterCloud/Organizations/Show';

const ShowOrganizationPage = () => {
  if (!router.query.organizationId) return null;

  return (
    <Layout>
      <ShowOrganizationContainer
        organizationId={Number(router.query.organizationId)}
      />
    </Layout>
  );
};

export default ShowOrganizationPage;
