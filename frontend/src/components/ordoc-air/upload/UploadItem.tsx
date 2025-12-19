'use client';

import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DocumentService } from '@/services/ordoc-air/documents';
import UploadProgress from './UploadProgress';

interface UploadItemProps {
  file: File;
}

const UploadItem: React.FC<UploadItemProps> = ({ file }) => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (f: File) =>
      DocumentService.uploadDocument(f, undefined, (p) => setProgress(p)),
  });

  useEffect(() => {
    mutation.mutate(file);
  }, [file]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{file.name}</span>
        {mutation.isSuccess && <span className="text-green-600">Feito</span>}
        {mutation.isError && <span className="text-red-600">Erro</span>}
      </div>
      <UploadProgress progress={progress} />
    </div>
  );
};

export default UploadItem;
