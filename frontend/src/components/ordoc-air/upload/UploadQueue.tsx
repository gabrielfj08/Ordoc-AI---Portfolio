'use client';

import React from 'react';
import UploadItem from './UploadItem';

interface UploadQueueProps {
  files: File[];
}

const UploadQueue: React.FC<UploadQueueProps> = ({ files }) => {
  if (!files.length) return null;

  return (
    <div className="space-y-4 mt-4">
      {files.map((file) => (
        <UploadItem key={file.name + file.size} file={file} />
      ))}
    </div>
  );
};

export default UploadQueue;
