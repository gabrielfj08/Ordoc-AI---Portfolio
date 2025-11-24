'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Home from './Home';
import HomeError from './Error';
import HomeSkeleton from './Skeleton';

const HomeContainer = () => {
  // Mock data para desenvolvimento - substituir por serviço real
  const { isError, isLoading, data } = useQuery({
    queryKey: ['createReport'],
    queryFn: async () => {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: 1 };
    },
  });

  if (isError) return <HomeError />;

  if (isLoading) return <HomeSkeleton />;

  if (!data) {
    return <div>Carregando...</div>;
  }
  
  return <Home reportId={data.id} />;
};

export default HomeContainer;
