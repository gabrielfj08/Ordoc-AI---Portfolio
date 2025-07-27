import * as React from 'react';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { useModal } from '../../../hooks';
import { RecentTableProps } from './types';
import DocumentPreviewModal from '../../MyAir/Documents/Modals/Preview';
import DocumentCell from './Table/Cells/Document';
import BreadcrumbCell from './Table/Cells/Breadcrumb';
import LastAccessedAtCell from './Table/Cells/LastAccessedAt';
import MenuCellContainer from './Table/Cells/Menu';
import IndeterminateCheckbox from '../IndeterminateCheckbox/IndeterminateCheckbox';

const RecentsTable = ({ data, setSelectedDocumentIds }: RecentTableProps) => {
  const { openModal } = useModal();

  const [rowSelection, setRowSelection] = React.useState({});
  React.useEffect(() => {
    setSelectedDocumentIds &&
      setSelectedDocumentIds(
        Object.keys(rowSelection).map((row) => data[row].documentId)
      );
  }, [rowSelection]);

  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'Checkbox',
      header: ({ table }) => (
        <div className="px-4 sm:px-7 flex justify-center w-fit">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: (info) => (
        <div className="px-4 sm:px-7 flex justify-center w-fit">
          <IndeterminateCheckbox
            value={info.getValue().id}
            {...{
              checked: info.row.getIsSelected(),
              indeterminate: info.row.getIsSomeSelected(),
              onChange: info.row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),

    columnHelper.accessor((row) => row, {
      id: 'Document',
      header: () => (
        <Typography
          color="gray"
          variant="footnote1"
          family="robotoLight"
          className="w-fit"
        >
          Arquivo
        </Typography>
      ),
      cell: (info) => <DocumentCell recentDocument={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Breadcrumb',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block"
          >
            Caminho
          </Typography>
        </div>
      ),
      cell: (info) => <BreadcrumbCell recentDocument={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'LastAccessedAtCell',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block"
          >
            Data de acesso
          </Typography>
        </div>
      ),
      cell: (info) => <LastAccessedAtCell recentDocument={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCellContainer recentDocument={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table className="w-full border border-lighterGray">
        <thead className="border border-lighterGray">
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
        {table.getRowModel().rows.map((row) => {
          return (
            <tbody key={row.id} className="divide-y divide-lighterGray">
              <tr
                className="h-20 hover:bg-blue/5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(
                    <DocumentPreviewModal
                      documentId={row.original.document.id}
                    />
                  );
                }}
              >
                {row.getVisibleCells().map((cell) => {
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
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default RecentsTable;
