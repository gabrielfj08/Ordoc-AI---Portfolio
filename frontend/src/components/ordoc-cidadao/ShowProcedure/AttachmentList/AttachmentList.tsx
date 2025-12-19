'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface AttachmentListProps {
  attachments: Array<{
    id: number;
    name: string;
    size: number;
    url: string;
  }>;
}

const AttachmentList = ({ attachments }: AttachmentListProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (attachment: any) => {
    // TODO: Implement real download functionality
    console.log('Download attachment:', attachment.id);
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Nenhum anexo encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{attachment.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(attachment)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AttachmentList;
