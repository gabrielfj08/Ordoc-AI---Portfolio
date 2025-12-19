'use client';

import * as React from 'react';
import { HomeProps } from './types';
import OrganizationFooter from './OrganizationFooter';
import Cards from './Cards';

const Home = ({ reportId }: HomeProps) => {
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">
          Home
        </h1>
      </div>
      
      <Cards reportId={reportId} />
      
      <div className="mt-8">
        <OrganizationFooter />
      </div>
    </main>
  );
};

export default Home;
