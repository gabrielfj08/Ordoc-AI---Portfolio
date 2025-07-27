import * as React from 'react';
import router from 'next/router';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { ProcedureTemplatesTableProps } from './types';
import MenuCellContainer from './Cells/Menu';
import ProcedureTemplate from './Cells/ProcedureTemplate';
import ProcedureTemplateSource from './Cells/Source';
import ChildrenCount from './Cells/ChildrenCount';
import ProcedureTemplateStatus from './Cells/Status';

const ProcedureTemplatesTable = ({ data }: ProcedureTemplatesTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'name',
      header: () => (
        <div className="px-3 w-44 sm:w-auto truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="truncate"
          >
            Nome do tipo de processo
          </Typography>
        </div>
      ),
      cell: (info) => (
        <ProcedureTemplate procedureTemplates={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'requesterType',
      header: () => (
        <div className="w-full sm:w-44 px-4 flex items-center justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Tipo
          </Typography>
        </div>
      ),
      cell: (info) => (
        <ProcedureTemplateSource procedureTemplates={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'childrensCount',
      header: () => (
        <div className="w-fit sm:w-full  flex justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block lg:text-right md:text-center"
          >
            N° de assuntos
          </Typography>
        </div>
      ),
      cell: (info) => <ChildrenCount procedureTemplates={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'status',
      header: () => (
        <div className="hidden sm:flex w-full sm:w-44 sm:px-4 items-center justify-center">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Status
          </Typography>
        </div>
      ),
      cell: (info) => (
        <ProcedureTemplateStatus procedureTemplates={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => (
        <MenuCellContainer procedureTemplates={info.getValue()} />
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
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
              <tr
                key={row.id}
                className="h-20 hover:bg-blue/5 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/printer-flow/procedure-templates/${row.original.id}`
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

export default ProcedureTemplatesTable;
