'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CardsContainerProps } from '../types';
import Cards from './Cards';
import CardsSkeleton from './Skeleton';
import CardsError from './Error';

const CardsContainer = ({ reportId }: CardsContainerProps) => {
  const queryClient = useQueryClient();
  
  // Mock data para desenvolvimento - substituir por serviço real
  const { isError, isLoading, data } = useQuery({
    queryKey: ['showReport', reportId],
    queryFn: async () => {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        proceduresRunningCount: 5,
        proceduresStartedCount: 12,
        tasksRunningCount: 3,
        signaturesPendingCount: 2,
        sharedProceduresPendingCount: 1,
      };
    },
  });

  if (isError) return <CardsError />;

  if (isLoading) return <CardsSkeleton />;

  const handleClick = () => {
    queryClient.invalidateQueries({
      queryKey: ['showReport', reportId]
    });
  };

  if (!data) {
    return <div>Carregando...</div>;
  }
  
  return <Cards reportData={data} handleClick={handleClick} />;
};

export default CardsContainer;
