'use client';

import React from 'react';
import type { ShareableLink } from '@/types/ordoc-air/shareableLink';

export interface LinkListProps {
  links: ShareableLink[];
  onDelete: (id: string) => void;
}

const buildLink = (token: string) => {
  if (typeof window === 'undefined') return token;
  return `${window.location.origin}/api/v1/ordoc-air/shareable-links/by_token/?token=${token}`;
};

const LinkList: React.FC<LinkListProps> = ({ links, onDelete }) => {
  if (links.length === 0) {
    return <p className="mt-4 text-sm text-gray-500">Nenhum link gerado.</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {links.map((link) => {
        const url = buildLink(link.token);
        return (
          <li
            key={link.id}
            className="flex items-center justify-between text-sm border rounded p-2"
          >
            <span className="truncate mr-2" title={url}>
              {url}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="text-blue-600 hover:underline"
                type="button"
              >
                Copiar
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="text-red-600 hover:underline"
                type="button"
              >
                Excluir
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default LinkList;
