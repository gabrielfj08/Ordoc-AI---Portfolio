import * as React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ShowUser from '../../../components/PrinterCloud/Users/Show';
import UserViewSkeleton from '../../../components/PrinterCloud/Users/Show/ShowSkeleton';

const UserViewPage = () => {
  const router = useRouter();

  if (!router.query.id) return <UserViewSkeleton />;

  return (
    <Layout>
      <ShowUser userId={Number(router.query.id)} />
    </Layout>
  );
};

export default UserViewPage;
