import * as React from 'react';
import getConfig from 'next/config';
import { useAuth, useSession } from '../../../../hooks';
import { DocumentVersionService } from '../../../../services/printer-air';
import { DeleteDocumentVersionAPIResponse } from '../../../../services/printer-air/types';
import { DocumentVersionContainerProps } from './types';
import DocumentVersion from './DocumentVersion';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const DocumentVersionContainer = ({
  documentVersion,
  title,
  total,
}: DocumentVersionContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const handleDownload = () => {
    window.document.open(documentVersion.url, '_blank', 'noreferrer');
  };

  const handleDelete = (): Promise<DeleteDocumentVersionAPIResponse> => {
    return DocumentVersionService.destroy(
      token,
      subdomain,
      session.organization.id,
      documentVersion.id
    );
  };

  return (
    <DocumentVersion
      documentVersion={documentVersion}
      title={title}
      total={total}
      onDownload={handleDownload}
      onDelete={handleDelete}
    />
  );
};

export default DocumentVersionContainer;
