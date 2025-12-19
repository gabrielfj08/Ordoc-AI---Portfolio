'use client';

import React, { useCallback, useRef } from 'react';

interface DragAndDropProps {
  onFiles: (files: FileList | null) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFiles }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onFiles(e.dataTransfer.files);
    },
    [onFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onFiles(e.target.files);
  };

  return (
    <div
      className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer text-sm text-gray-600"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <p>Arraste e solte arquivos aqui ou clique para selecionar</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default DragAndDrop;
