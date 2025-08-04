'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Folder,
  FileText,
  Upload,
  PlusCircle,
  ChevronRight,
  Home,
  AlertTriangle,
} from 'lucide-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import directoriesService from '@/services/ordoc-air/directories';
import documentsService from '@/services/ordoc-air/documents';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { RecentDocuments } from '@/components/ordoc-air';

interface Directory {
  id: number;
  name: string;
}

interface Document {
  id: number;
  title?: string;
  filename?: string;
  created_at?: string;
}

function OrdocAirContent() {
  const [currentDir, setCurrentDir] = useState<number | null>(null);
  const [path, setPath] = useState<Directory[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const {
    data: directoriesData,
    isLoading: dirsLoading,
    error: dirsError,
    refetch: refetchDirs,
  } = useQuery({
    queryKey: ['directories', currentDir],
    queryFn: () =>
      currentDir
        ? directoriesService.getChildren(currentDir)
        : directoriesService.list({ parent: null }),
  });

  const {
    data: documentsData,
    isLoading: docsLoading,
    error: docsError,
    refetch: refetchDocs,
  } = useQuery({
    queryKey: ['documents', currentDir],
    queryFn: () =>
      currentDir
        ? directoriesService.getDocuments(currentDir)
        : documentsService.list({ directory: null }),
  });

  const directories: Directory[] =
    directoriesData?.results || directoriesData || [];
  const documents: Document[] =
    documentsData?.results || documentsData || [];
  const hasDepartments =
    currentDir !== null
      ? true
      : directoriesData?.has_departments ?? true;

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      if (currentDir) formData.append('directory', String(currentDir));
      return documentsService.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', currentDir] });
    },
  });

  const createDirMutation = useMutation({
    mutationFn: (name: string) =>
      directoriesService.create({ name, parent: currentDir }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directories', currentDir] });
    },
  });

  const handleNavigate = (dir: Directory) => {
    setCurrentDir(dir.id);
    setPath((prev) => [...prev, dir]);
  };

  const handleBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentDir(null);
      setPath([]);
    } else {
      const newPath = path.slice(0, index + 1);
      setCurrentDir(newPath[newPath.length - 1].id);
      setPath(newPath);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const handleCreateDirectory = () => {
    const name = prompt('Nome da nova pasta:');
    if (name) createDirMutation.mutate(name);
  };

  const isLoading = dirsLoading || docsLoading;
  const isError = dirsError || docsError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Folder className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">OrdocAir</h1>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600 space-x-1">
            <button
              onClick={() => handleBreadcrumb(-1)}
              className="flex items-center hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-1" />
              Raiz
            </button>
            {path.map((dir, idx) => (
              <React.Fragment key={dir.id}>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => handleBreadcrumb(idx)}
                  className="hover:text-gray-900"
                >
                  {dir.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              disabled={uploadMutation.isPending}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </button>
            <button
              onClick={handleCreateDirectory}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
              disabled={createDirMutation.isPending}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Nova Pasta
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando documentos...</span>
          </div>
        ) : isError ? (
          <ErrorState message="Erro ao conectar com o servidor" />
        ) : !hasDepartments ? (
          <EmptyState
            icon={FolderIcon}
            title="Nenhum departamento encontrado"
            description="Crie um departamento para começar"
            actionButton={{ text: 'Criar Departamento', onClick: handleCreateDirectory }}
          />
        ) : !directories.length ? (
          <EmptyState
            icon={FolderOpenIcon}
            title="Nenhuma pasta encontrada"
            description="Crie uma pasta para organizar seus documentos"
          />
        ) : (
          <div className="space-y-8">
            <RecentDocuments />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Pastas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {directories.map((dir) => (
                  <div
                    key={dir.id}
                    onClick={() => handleNavigate(dir)}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow cursor-pointer flex items-center space-x-3"
                  >
                    <Folder className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {dir.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Documentos
              </h2>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum documento encontrado.
                </p>
              ) : (
                <ul className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.title || doc.filename}
                          </p>
                          {doc.created_at && (
                            <p className="text-xs text-gray-500">
                              {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdocAir() {
  return (
    <ProtectedRoute>
      <OrdocAirContent />
    </ProtectedRoute>
  );
}

