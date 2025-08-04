'use client';

import React, { useState } from 'react';

export interface PermissionControlsProps {
  onCreate: (expiresAt: string | null) => void;
}

const PermissionControls: React.FC<PermissionControlsProps> = ({ onCreate }) => {
  const [expiresAt, setExpiresAt] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(expiresAt || null);
    setExpiresAt('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 mt-2">
      <div className="flex flex-col flex-1">
        <label className="text-sm mb-1">Expira em</label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="border rounded p-1 text-sm"
        />
      </div>
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        Gerar
      </button>
    </form>
  );
};

export default PermissionControls;
