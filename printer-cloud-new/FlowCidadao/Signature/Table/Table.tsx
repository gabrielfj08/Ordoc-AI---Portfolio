import * as React from 'react';
import { TableV3 as Table, TypographyV3 as Typography } from 'printer-ui';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { AuthExternalProvider, useModal } from '../../../hooks';
import { SignatureTableProps } from './types';
import CreatedAtCell from './Cells/CreatedAt';
import DocumentNameCell from './Cells/DocumentName';
import StatusCell from './Cells/Status';
import MenuSignatureCell from './Cells/Menu';
import SignatureExternalDocumentPreviewModal from '../../components/Signatures/PreviewDocuments';
import { IndexExternalSignature } from '../../../services/flow-cidadao/types';

const SignatureTable = ({ data, color }: SignatureTableProps) => {
  const columnHelper = createColumnHelper<any>();
  const { openModal } = useModal();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'documentName',
      header: 'Nome do documento',
      cell: (info) => (
        <DocumentNameCell color={color} signature={info.getValue()} />
      ),
    }),

    columnHelper.accessor((row) => row, {
      id: 'createdAt',
      header: 'Solicitado em',
      cell: (info) => (
        <CreatedAtCell color={color} signature={info.getValue()} />
      ),
    }),

    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      cell: (info) => <StatusCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: '',
      cell: (info) => <MenuSignatureCell signature={info.getValue()} />,
    }),
  ];

  return (
    <Table
      data={data}
      columns={columns}
      color={color}
      onClick={(signature: IndexExternalSignature) => {
        openModal(
          <AuthExternalProvider>
            <SignatureExternalDocumentPreviewModal
              signatureId={signature.id}
              isRefusing={false}
            />
          </AuthExternalProvider>
        );
      }}
    />
  );
};

export default SignatureTable;
