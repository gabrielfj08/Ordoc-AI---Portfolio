"use client";

import { useMemo } from "react";

// Definição dos tipos de permissão baseados no que planejamos
export type Permission = 'read' | 'edit' | 'admin';

interface Item {
  ownerId: string;
  permissions?: Permission[];
}

export const usePermissions = (item: Item | null) => {
  // Simulação do utilizador logado (no futuro virá do seu Auth Context)
  const currentUser = { id: 'u1' }; 

  return useMemo(() => {
    if (!item) return { canEdit: false, canShare: false, isOwner: false };

    const isOwner = item.ownerId === currentUser.id;
    const canEdit = isOwner || item.permissions?.includes('edit') || item.permissions?.includes('admin');
    const canShare = isOwner || item.permissions?.includes('admin');

    return {
      isOwner,
      canEdit,
      canShare,
    };
  }, [item, currentUser.id]);
};