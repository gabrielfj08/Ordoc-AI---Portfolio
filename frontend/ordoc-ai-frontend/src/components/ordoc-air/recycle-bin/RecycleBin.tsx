'use client';

import React, { useState } from 'react';
import { RowSelectedItem, RecycleBinProps } from '@/types/ordoc-air/recycle-bin';
import DirectoriesTable from './DirectoriesTable';
import DocumentsTable from './DocumentsTable';
import SelectedItemsMenuButton from './SelectedItemsMenuButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RecycleBin: React.FC<RecycleBinProps> = () => {
  const [selectedDirectories, setSelectedDirectories] = useState<RowSelectedItem[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<RowSelectedItem[]>([]);

  const items = selectedDocuments.concat(selectedDirectories);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lixeira</h1>
        <p className="text-muted-foreground">
          Gerencie documentos e pastas excluídos
        </p>
      </div>

      {items.length > 0 && (
        <div className="w-full">
          <SelectedItemsMenuButton
            selectedDirectories={selectedDirectories}
            selectedDocuments={selectedDocuments}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Itens Excluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="directories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="directories">Pastas</TabsTrigger>
              <TabsTrigger value="documents">Arquivos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="directories" className="space-y-4">
              <DirectoriesTable setSelectedDirectories={setSelectedDirectories} />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <DocumentsTable setSelectedDocuments={setSelectedDocuments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecycleBin;
