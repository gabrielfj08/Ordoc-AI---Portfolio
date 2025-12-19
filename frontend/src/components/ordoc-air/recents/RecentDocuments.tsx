'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import recentDocumentsService from '@/services/ordoc-air/recentDocuments';
import RecentCard, { RecentDocument } from './RecentCard';

const RecentDocuments: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentDocuments'],
    queryFn: async () => {
      try {
        return await recentDocumentsService.list();
      } catch (error) {
        // Mock data for development
        console.warn('Recent documents failed, using mock data:', error);
        return [];
      }
    },
  });

  if (isLoading) return <div>Carregando documentos recentes...</div>;
  if (error) return <div>Erro ao carregar documentos recentes.</div>;

  const recents: RecentDocument[] = data?.results || data || [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Documentos Recentes
      </h2>
      {recents.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum documento recente.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recents.map((recent) => (
            <RecentCard key={recent.id} recent={recent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentDocuments;
