'use client';

import React, { useState, useEffect } from 'react';
import { RecycleBinDocumentsTableProps, DeletedDocument, RowSelectedItem } from '@/types/ordoc-air/recycle-bin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, FileText, Download, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Removed date-fns dependency - using native Date formatting
import { useQuery } from '@tanstack/react-query';
import { recycleBinService } from '@/services/ordoc-air/recycle-bin';

const DocumentsTable: React.FC<RecycleBinDocumentsTableProps> = ({
  setSelectedDocuments,
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const { data: documents = [], isLoading, error } = useQuery<DeletedDocument[]>({
    queryKey: ['recycle-bin-documents'],
    queryFn: () => recycleBinService.getDeletedDocuments(),
  });

  // Update selected documents when data changes
  useEffect(() => {
    if (documents && Array.isArray(documents)) {
      const selected = documents
        .filter((d: DeletedDocument) => selectedItems[d.id])
        .map((d: DeletedDocument) => ({ id: d.id, name: d.originalFilename }));
      setSelectedDocuments?.(selected);
    }
  }, [selectedItems, documents, setSelectedDocuments]);

  const handleSelectAll = (checked: boolean) => {
    if (documents && Array.isArray(documents)) {
      const newSelected = documents.reduce((acc: Record<string, boolean>, doc: DeletedDocument) => {
        acc[doc.id] = checked;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedItems(newSelected);
    } else {
      setSelectedItems({});
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [id.toString()]: checked,
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📄';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Erro ao carregar documentos excluídos</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Nenhum documento na lixeira</p>
      </div>
    );
  }

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const allSelected = selectedCount === documents.length;
  const someSelected = selectedCount > 0 && selectedCount < documents.length;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <Checkbox
              checked={
                documents && documents.length > 0 && 
                documents.every((d: DeletedDocument) => selectedItems[d.id])
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <TableHead>Arquivo</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Excluído por</TableHead>
            <TableHead>Data de exclusão</TableHead>
            <TableHead className="w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <Checkbox
                  checked={selectedItems[document.id] || false}
                  onChange={(e) => handleSelectItem(document.id, e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {getMimeTypeIcon(document.mimeType)}
                  </span>
                  <div>
                    <p className="font-medium">{document.originalFilename}</p>
                    <p className="text-sm text-muted-foreground">
                      {document.directory.path}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default">{document.mimeType}</Badge>
                <Badge variant="default">
                  {formatFileSize(document.size)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{document.deletedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {document.deletedBy.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(document.deletedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;
