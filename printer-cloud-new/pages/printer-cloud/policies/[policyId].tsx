import * as React from 'react';
import { useRouter } from 'next/router';
import Show from '../../../components/PrinterCloud/Policies/Show';
import PolicyViewSkeleton from '../../../components/PrinterCloud/Policies/Show/Skeleton';

const PoliciesViewPage = () => {
  const router = useRouter();

  if (!router.query.policyId) {
    return <PolicyViewSkeleton />;
  }

  return <Show policyId={Number(router.query.policyId)} />;
};

export default PoliciesViewPage;
