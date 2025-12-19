'use client';

import React, { useState, useEffect } from 'react';
import { RecycleBinDirectoriesTableProps, DeletedDirectory, RowSelectedItem } from '@/types/ordoc-air/recycle-bin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Folder, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Removed date-fns dependency - using native Date formatting
import { useQuery } from '@tanstack/react-query';
import { recycleBinService } from '@/services/ordoc-air/recycle-bin';

const DirectoriesTable: React.FC<RecycleBinDirectoriesTableProps> = ({
  setSelectedDirectories,
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const { data: directories = [], isLoading, error } = useQuery<DeletedDirectory[]>({
    queryKey: ['recycle-bin-directories'],
    queryFn: () => recycleBinService.getDeletedDirectories(),
  });

  useEffect(() => {
    if (setSelectedDirectories) {
      const selected = directories
        .filter((d: DeletedDirectory) => selectedItems[d.id])
        .map((d: DeletedDirectory) => ({ id: d.id, name: d.name }));
      setSelectedDirectories(selected);
    }
  }, [selectedItems, directories, setSelectedDirectories]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = directories.reduce((acc: Record<string, boolean>, dir: DeletedDirectory) => {
        acc[dir.id] = checked;
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
        <p className="text-muted-foreground">Erro ao carregar diretórios excluídos</p>
      </div>
    );
  }

  if (directories.length === 0) {
    return (
      <div className="text-center py-8">
        <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Nenhuma pasta na lixeira</p>
      </div>
    );
  }

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const allSelected = selectedCount === directories.length;
  const someSelected = selectedCount > 0 && selectedCount < directories.length;
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <Checkbox
              checked={
                directories && directories.length > 0 && 
                directories.every((d: DeletedDirectory) => selectedItems[d.id])
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <TableHead>Pasta</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Excluído por</TableHead>
            <TableHead>Data de exclusão</TableHead>
            <TableHead className="w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directories.map((directory: DeletedDirectory) => (
            <TableRow key={directory.id}>
              <TableCell>
                <Checkbox
                  checked={selectedItems[directory.id] || false}
                  onChange={(e) => handleSelectItem(directory.id, e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{directory.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {directory.path}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">
                  {directory.parentDirectory?.path || '/'}
                </p>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{directory.deletedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {directory.deletedBy.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(directory.deletedAt).toLocaleDateString('pt-BR', {
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

export default DirectoriesTable;
