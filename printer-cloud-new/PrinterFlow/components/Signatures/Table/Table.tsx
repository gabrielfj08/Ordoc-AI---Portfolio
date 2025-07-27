import * as React from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { SignaturesTableProps } from './types';
import SignableTypeCell from './Cells/SignableType';
import DocumentNameCell from './Cells/DocumentName';
import ProcedureCell from './Cells/Procedure';
import RequesterCell from './Cells/Requester';
import RequestedAtCell from './Cells/RequestedAt';
import MenuButtonCell from './Cells/MenuButton';
import SignatureDocumentModal from '../../../Signatures/Modals/PreviewDocuments';
import StatusAssigneeDocumentCell from './Cells/StatusAssignee';

const SignaturesTable = ({ data, filter }: SignaturesTableProps) => {
  const columnHelper = createColumnHelper<any>();
  const { openModal } = useModal();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'SignableType',
      header: () => (
        <div className="justify-center px-2 2xl:px-6 w-12 hidden 2xl:block" />
      ),
      cell: (info) => <SignableTypeCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'DocumentName',
      header: () => (
        <div className="px-2 w-fit">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Documento
          </Typography>
        </div>
      ),
      cell: (info) => <DocumentNameCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Procedure',
      header: () => (
        <div className="w-full hidden xl:flex justify-center px-6 max-w-[240px]">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:flex text-center"
          >
            Processo
          </Typography>
        </div>
      ),
      cell: (info) => <ProcedureCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Requester',
      header: () => (
        <div className="hidden lg:flex justify-center w-48">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Solicitante
          </Typography>
        </div>
      ),
      cell: (info) => <RequesterCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'RequestedAt',
      header: () => (
        <div key="Responsible" className=" flex justify-center w-28 2xl:w-44">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Solicitado em
          </Typography>
        </div>
      ),
      cell: (info) => <RequestedAtCell signature={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div key="Status" className="w-1/12 hidden lg:flex">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Status
          </Typography>
        </div>
      ),
      cell: (info) => (
        <StatusAssigneeDocumentCell signature={info.getValue()} />
      ),
    }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuButtonCell signature={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        Status: filter === 'inProgress' ? true : false,
      },
    },
  });

  return (
    <div>
      <div className="h-2" />
      <table className="w-full border bg-white border-lightGray">
        <thead className="border border-lightGray">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center h-20">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-lightGray">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="h-20 hover:bg-blue/5 cursor-pointer"
                onClick={() =>
                  openModal(
                    <SignatureDocumentModal signatureId={row.original.id} />
                  )
                }
              >
                {row.getCenterVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SignaturesTable;
