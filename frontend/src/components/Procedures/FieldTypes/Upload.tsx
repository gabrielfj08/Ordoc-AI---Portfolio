import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UploadProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function Upload({ 
  onFileSelect, 
  accept = "*/*", 
  multiple = false, 
  maxSize = 10,
  className = "" 
}: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo: ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFileSelect?.([...selectedFiles, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
      onFileSelect?.(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect?.(newFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Clique para enviar
              </span>{' '}
              ou arraste e solte
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept !== "*/*" && `Formatos: ${accept} • `}
              Máximo: {maxSize}MB
              {multiple && " • Múltiplos arquivos"}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de arquivos selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Arquivos selecionados ({selectedFiles.length})
          </h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
