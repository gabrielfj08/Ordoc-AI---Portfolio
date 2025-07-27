import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import ExternalProfile from '../../FlowCidadao/Profile';
import Layout from '../../FlowCidadao/components/Layout';

const ProfilePage = () => {
  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Editar perfil</title>
      </Head>
      <Layout
        internal={true}
        icon="editV3"
        title="Meu perfil"
        subtitle="Aqui você pode modificar seus dados de cadastro."
      >
        <ExternalProfile />
      </Layout>
    </div>
  );
};

const ProfilePageContainer = () => {
  return (
    <AuthExternalProvider>
      <ProfilePage />
    </AuthExternalProvider>
  );
};

export default ProfilePageContainer;
