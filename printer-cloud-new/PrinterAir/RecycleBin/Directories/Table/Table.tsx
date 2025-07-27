import * as React from 'react';
import IndeterminateCheckbox from '../../../components/IndeterminateCheckbox/IndeterminateCheckbox';
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
import { RecycleBinDirectoriesTableProps } from './types';
import DeletedAtCell from './Cells/DeletedAt';
import DeletedByCell from './Cells/DeletedBy';
import DirectoryCell from './Cells/Directory';
import MenuCell from './Cells/Menu';

const RecycleBinDirectoriesTable = ({
  data,
  setSelectedDirectories,
}: RecycleBinDirectoriesTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({});
  React.useEffect(() => {
    setSelectedDirectories &&
      setSelectedDirectories(
        Object.keys(rowSelection).map((row) => {
          return { id: data[row].id, name: data[row].name };
        })
      );
  }, [rowSelection]);

  const columnHelper = createColumnHelper<string>();

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
      id: 'Directory',
      header: () => (
        <Typography
          color="gray"
          variant="footnote1"
          family="robotoLight"
          className="w-fit"
        >
          Pasta
        </Typography>
      ),
      cell: (info) => <DirectoryCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'DeletedBy',
      header: () => (
        <div className="w-full">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:block text-center"
          >
            Excluído por
          </Typography>
        </div>
      ),
      cell: (info) => <DeletedByCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'DeletedAt',
      header: () => (
        <div className="w-full">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:flex justify-center"
          >
            Data de exclusão
          </Typography>
        </div>
      ),
      cell: (info) => <DeletedAtCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12"></div>,
      cell: (info) => <MenuCell directory={info.getValue()} />,
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
        <tbody className="divide-y divide-lighterGray">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="h-20 hover:bg-blue/5">
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecycleBinDirectoriesTable;
