import * as React from 'react';
import router from 'next/router';
import { TableV3 as Table, TypographyV3 as Typography } from 'printer-ui';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SharedProcedureTableProps } from './types';
import ProcessNumberCell from './Cells/ProcessNumber';
import SharedByCell from './Cells/SharedBy';
import SharedAtCell from './Cells/SharedAt';
import StatusCell from './Cells/Status';
import ActionsCell from './Cells/Actions';

const SharedProcedureTable = ({ data, color }: SharedProcedureTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'processNumber',
      header: 'Nº do processo',
      cell: (info) => (
        <ProcessNumberCell sharedProcedure={info.getValue()} color={color} />
      ),
    }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'sharedByMobile',
          header: '',
          cell: (info) => (
            <SharedByCell sharedProcedure={info.getValue()} color={color} />
          ),
        })
      : columnHelper.accessor((row) => row, {
          id: 'sharedBy',
          header: () => (
            <div className="sm:flex items-center justify-center">
              <Typography
                color="cidGrayDark"
                variant="bodyMd"
                family="jakartaMedium"
              >
                Compartilhado por
              </Typography>
            </div>
          ),
          cell: (info) => (
            <SharedByCell sharedProcedure={info.getValue()} color={color} />
          ),
        }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'sharedAtMobile',
          header: '',
          cell: (info) => (
            <SharedAtCell sharedProcedure={info.getValue()} color={color} />
          ),
        })
      : columnHelper.accessor((row) => row, {
          id: 'sharedAt',
          header: () => (
            <div className="sm:flex items-center justify-center">
              <Typography
                color="cidGrayDark"
                variant="bodyMd"
                family="jakartaMedium"
              >
                Data de compartilhamento
              </Typography>
            </div>
          ),
          cell: (info) => (
            <SharedAtCell sharedProcedure={info.getValue()} color={color} />
          ),
        }),

    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      cell: (info) => <StatusCell sharedProcedure={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'actions',
      header: 'Ações:',
      cell: (info) => (
        <ActionsCell sharedProcedure={info.getValue()} color={color} />
      ),
    }),
  ];

  return (
    <Table data={data} columns={columns} color={color} onClick={() => {}} />
  );
};

export default SharedProcedureTable;
